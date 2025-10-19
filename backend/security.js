/**
 * Security utilities for ChatKit Backend
 * Implements secure API key management and security best practices
 */

const crypto = require('crypto');

class SecurityManager {
    constructor() {
        this.apiKeyHash = null;
        this.rateLimitStore = new Map();
        this.maxRequestsPerMinute = 60;
        this.maxRequestsPerHour = 1000;
    }

    /**
     * Securely hash and store API key
     */
    initializeApiKey(apiKey) {
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY is required');
        }

        // Validate API key format
        if (!this.validateApiKeyFormat(apiKey)) {
            throw new Error('Invalid OpenAI API key format');
        }

        // Hash the API key for storage (never store plain text)
        this.apiKeyHash = this.hashApiKey(apiKey);
        
        console.log('✅ API key securely initialized');
        return apiKey; // Return original for OpenAI client
    }

    /**
     * Validate OpenAI API key format
     */
    validateApiKeyFormat(apiKey) {
        // OpenAI API keys start with 'sk-' and are 48+ characters
        const openaiKeyPattern = /^sk-[a-zA-Z0-9]{48,}$/;
        return openaiKeyPattern.test(apiKey);
    }

    /**
     * Hash API key for secure storage
     */
    hashApiKey(apiKey) {
        return crypto.createHash('sha256').update(apiKey).digest('hex');
    }

    /**
     * Verify API key hasn't changed
     */
    verifyApiKey(apiKey) {
        if (!this.apiKeyHash) return false;
        return this.hashApiKey(apiKey) === this.apiKeyHash;
    }

    /**
     * Rate limiting implementation
     */
    checkRateLimit(clientId) {
        const now = Date.now();
        const minute = Math.floor(now / 60000);
        const hour = Math.floor(now / 3600000);

        // Initialize client data if not exists
        if (!this.rateLimitStore.has(clientId)) {
            this.rateLimitStore.set(clientId, {
                requestsPerMinute: new Map(),
                requestsPerHour: new Map()
            });
        }

        const clientData = this.rateLimitStore.get(clientId);

        // Check minute limit
        const minuteRequests = clientData.requestsPerMinute.get(minute) || 0;
        if (minuteRequests >= this.maxRequestsPerMinute) {
            return {
                allowed: false,
                reason: 'Rate limit exceeded: too many requests per minute',
                retryAfter: 60 - (now % 60000) / 1000
            };
        }

        // Check hour limit
        const hourRequests = clientData.requestsPerHour.get(hour) || 0;
        if (hourRequests >= this.maxRequestsPerHour) {
            return {
                allowed: false,
                reason: 'Rate limit exceeded: too many requests per hour',
                retryAfter: 3600 - (now % 3600000) / 1000
            };
        }

        // Increment counters
        clientData.requestsPerMinute.set(minute, minuteRequests + 1);
        clientData.requestsPerHour.set(hour, hourRequests + 1);

        // Clean up old data
        this.cleanupRateLimitData(clientId);

        return { allowed: true };
    }

    /**
     * Clean up old rate limit data
     */
    cleanupRateLimitData(clientId) {
        const clientData = this.rateLimitStore.get(clientId);
        const now = Date.now();
        const currentMinute = Math.floor(now / 60000);
        const currentHour = Math.floor(now / 3600000);

        // Remove data older than 1 hour
        for (const [minute] of clientData.requestsPerMinute) {
            if (minute < currentMinute - 60) {
                clientData.requestsPerMinute.delete(minute);
            }
        }

        for (const [hour] of clientData.requestsPerHour) {
            if (hour < currentHour - 24) {
                clientData.requestsPerHour.delete(hour);
            }
        }
    }

    /**
     * Input sanitization
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }

        // Remove potentially dangerous characters
        return input
            .replace(/[<>]/g, '') // Remove HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim()
            .substring(0, 1000); // Limit length
    }

    /**
     * Validate session ID format
     */
    validateSessionId(sessionId) {
        const sessionPattern = /^session_[a-zA-Z0-9_]{10,}$/;
        return sessionPattern.test(sessionId);
    }

    /**
     * Generate secure session ID
     */
    generateSecureSessionId() {
        const randomBytes = crypto.randomBytes(16);
        const timestamp = Date.now();
        return `session_${randomBytes.toString('hex')}_${timestamp}`;
    }

    /**
     * Security headers for responses
     */
    getSecurityHeaders() {
        return {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
        };
    }

    /**
     * Log security events
     */
    logSecurityEvent(event, details) {
        const timestamp = new Date().toISOString();
        console.log(`🔒 [SECURITY] ${timestamp} - ${event}:`, details);
    }
}

module.exports = SecurityManager;
