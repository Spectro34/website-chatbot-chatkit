/**
 * ChatKit Widget - Universal Integration Script
 * 
 * This is a standalone JavaScript file that can be embedded into any website
 * to add AI chatbot functionality. It handles all the communication with
 * the ChatKit backend and provides a clean, customizable chat interface.
 * 
 * Usage:
 * 1. Include this script in your HTML: <script src="https://yourdomain.com/chatkit-widget.js"></script>
 * 2. Initialize with: ChatKit.init({ backendUrl: 'https://yourdomain.com/api' });
 */

(function() {
    'use strict';

    // ChatKit Widget Class
    class ChatKitWidget {
        constructor(config = {}) {
            this.config = {
                backendUrl: config.backendUrl || 'http://localhost:3001',
                widgetTitle: config.widgetTitle || 'AI Assistant',
                welcomeMessage: config.welcomeMessage || 'Hello! How can I help you today?',
                placeholderText: config.placeholderText || 'Type your message...',
                toggleButtonText: config.toggleButtonText || '💬',
                position: config.position || 'bottom-right', // bottom-right, bottom-left, top-right, top-left
                theme: config.theme || 'light', // light, dark
                primaryColor: config.primaryColor || '#3498db',
                ...config
            };

            this.sessionId = null;
            this.isOpen = false;
            this.isInitialized = false;
            this.messageQueue = [];
            this.maxRetries = 3;
            this.retryDelay = 1000;

            this.init();
        }

        init() {
            if (this.isInitialized) return;
            
            this.createWidget();
            this.bindEvents();
            this.loadSession();
            this.isInitialized = true;
            
            console.log('ChatKit Widget initialized');
        }

        createWidget() {
            // Create container
            this.container = document.createElement('div');
            this.container.id = 'chatkit-widget-container';
            this.container.style.cssText = `
                position: fixed;
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            `;

            // Position the widget
            this.setPosition();

            // Create toggle button
            this.createToggleButton();

            // Create chat panel
            this.createChatPanel();

            // Add to DOM
            document.body.appendChild(this.container);
        }

        setPosition() {
            const positions = {
                'bottom-right': 'bottom: 20px; right: 20px;',
                'bottom-left': 'bottom: 20px; left: 20px;',
                'top-right': 'top: 20px; right: 20px;',
                'top-left': 'top: 20px; left: 20px;'
            };
            
            this.container.style.cssText += positions[this.config.position] || positions['bottom-right'];
        }

        createToggleButton() {
            this.toggleButton = document.createElement('button');
            this.toggleButton.id = 'chatkit-toggle-button';
            this.toggleButton.innerHTML = this.config.toggleButtonText;
            this.toggleButton.style.cssText = `
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: ${this.config.primaryColor};
                color: white;
                font-size: 24px;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
                outline: none;
            `;

            this.toggleButton.addEventListener('mouseenter', () => {
                this.toggleButton.style.transform = 'scale(1.1)';
            });

            this.toggleButton.addEventListener('mouseleave', () => {
                this.toggleButton.style.transform = 'scale(1)';
            });

            this.container.appendChild(this.toggleButton);
        }

        createChatPanel() {
            this.chatPanel = document.createElement('div');
            this.chatPanel.id = 'chatkit-chat-panel';
            this.chatPanel.style.cssText = `
                position: absolute;
                width: 350px;
                height: 500px;
                background-color: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.12);
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid #e1e5e9;
            `;

            // Position chat panel relative to toggle button
            if (this.config.position.includes('right')) {
                this.chatPanel.style.right = '0';
                this.chatPanel.style.bottom = '80px';
            } else {
                this.chatPanel.style.left = '0';
                this.chatPanel.style.bottom = '80px';
            }

            this.createChatHeader();
            this.createChatMessages();
            this.createChatInput();

            this.container.appendChild(this.chatPanel);
        }

        createChatHeader() {
            const header = document.createElement('div');
            header.style.cssText = `
                background-color: ${this.config.primaryColor};
                color: white;
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
            `;

            header.innerHTML = `
                <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${this.config.widgetTitle}</h3>
                <button id="chatkit-close-button" style="
                    background: none; 
                    border: none; 
                    color: white; 
                    font-size: 20px; 
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                ">&times;</button>
            `;

            this.chatPanel.appendChild(header);
        }

        createChatMessages() {
            this.messagesContainer = document.createElement('div');
            this.messagesContainer.id = 'chatkit-messages';
            this.messagesContainer.style.cssText = `
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
                background-color: #f8f9fa;
            `;

            this.chatPanel.appendChild(this.messagesContainer);
        }

        createChatInput() {
            const inputArea = document.createElement('div');
            inputArea.style.cssText = `
                display: flex;
                padding: 12px 16px;
                border-top: 1px solid #e1e5e9;
                background-color: white;
                gap: 8px;
            `;

            this.messageInput = document.createElement('input');
            this.messageInput.type = 'text';
            this.messageInput.placeholder = this.config.placeholderText;
            this.messageInput.style.cssText = `
                flex: 1;
                padding: 10px 12px;
                border: 1px solid #ddd;
                border-radius: 20px;
                outline: none;
                font-size: 14px;
                transition: border-color 0.2s;
            `;

            this.messageInput.addEventListener('focus', () => {
                this.messageInput.style.borderColor = this.config.primaryColor;
            });

            this.messageInput.addEventListener('blur', () => {
                this.messageInput.style.borderColor = '#ddd';
            });

            this.sendButton = document.createElement('button');
            this.sendButton.innerHTML = 'Send';
            this.sendButton.style.cssText = `
                background: ${this.config.primaryColor};
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background-color 0.2s;
            `;

            this.sendButton.addEventListener('mouseenter', () => {
                this.sendButton.style.opacity = '0.9';
            });

            this.sendButton.addEventListener('mouseleave', () => {
                this.sendButton.style.opacity = '1';
            });

            inputArea.appendChild(this.messageInput);
            inputArea.appendChild(this.sendButton);
            this.chatPanel.appendChild(inputArea);
        }

        bindEvents() {
            // Toggle button
            this.toggleButton.addEventListener('click', () => this.toggleChat());

            // Close button
            document.getElementById('chatkit-close-button').addEventListener('click', () => this.closeChat());

            // Send button
            this.sendButton.addEventListener('click', () => this.sendMessage());

            // Enter key in input
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            // Click outside to close
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.container.contains(e.target)) {
                    this.closeChat();
                }
            });
        }

        async loadSession() {
            this.sessionId = localStorage.getItem('chatkit_sessionId');
            if (this.sessionId) {
                await this.fetchMessages();
            }
        }

        async createSession() {
            try {
                const response = await this.makeRequest('/api/create-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.sessionId = data.sessionId;
                    localStorage.setItem('chatkit_sessionId', this.sessionId);
                    console.log('Session created:', this.sessionId);
                    return true;
                } else {
                    console.error('Failed to create session:', await response.text());
                    return false;
                }
            } catch (error) {
                console.error('Error creating session:', error);
                return false;
            }
        }

        async fetchMessages() {
            if (!this.sessionId) return;

            try {
                const response = await this.makeRequest(`/api/session/${this.sessionId}/messages`);
                if (response.ok) {
                    const data = await response.json();
                    this.messagesContainer.innerHTML = '';
                    
                    if (data.messages && data.messages.length > 0) {
                        data.messages.forEach(msg => {
                            this.addMessage(msg.role === 'user' ? 'You' : 'AI Assistant', msg.content, msg.role);
                        });
                    } else {
                        this.addMessage('AI Assistant', this.config.welcomeMessage, 'bot');
                    }
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                this.addMessage('System', 'Error loading chat history.', 'bot');
            }
        }

        async sendMessage() {
            const message = this.messageInput.value.trim();
            if (!message) return;

            // Add user message to UI
            this.addMessage('You', message, 'user');
            this.messageInput.value = '';

            // Ensure session exists
            if (!this.sessionId) {
                const sessionCreated = await this.createSession();
                if (!sessionCreated) {
                    this.addMessage('System', 'Error: Could not start chat session.', 'bot');
                    return;
                }
            }

            // Send to backend
            try {
                const response = await this.makeRequest('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: this.sessionId, message })
                });

                if (response.ok) {
                    const data = await response.json();
                    this.addMessage('AI Assistant', data.response, 'bot');
                } else {
                    const errorData = await response.json();
                    this.addMessage('System', `Error: ${errorData.message || errorData.error || 'Failed to get response.'}`, 'bot');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                this.addMessage('System', 'Error: Network issue. Please try again.', 'bot');
            }
        }

        addMessage(sender, text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                max-width: 80%;
                padding: 10px 14px;
                border-radius: 18px;
                word-wrap: break-word;
                font-size: 14px;
                line-height: 1.4;
                margin-bottom: 4px;
            `;

            if (type === 'user') {
                messageDiv.style.cssText += `
                    background-color: ${this.config.primaryColor};
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 4px;
                `;
            } else {
                messageDiv.style.cssText += `
                    background-color: #f1f3f4;
                    color: #333;
                    align-self: flex-start;
                    border-bottom-left-radius: 4px;
                `;
            }

            messageDiv.textContent = text;
            this.messagesContainer.appendChild(messageDiv);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }

        async makeRequest(url, options = {}) {
            const fullUrl = `${this.config.backendUrl}${url}`;
            
            for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
                try {
                    const response = await fetch(fullUrl, options);
                    return response;
                } catch (error) {
                    if (attempt === this.maxRetries) {
                        throw error;
                    }
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
                }
            }
        }

        toggleChat() {
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }

        openChat() {
            this.chatPanel.style.display = 'flex';
            this.toggleButton.style.display = 'none';
            this.isOpen = true;

            if (this.sessionId) {
                this.fetchMessages();
            } else {
                this.addMessage('AI Assistant', this.config.welcomeMessage, 'bot');
            }

            // Focus input
            setTimeout(() => this.messageInput.focus(), 100);
        }

        closeChat() {
            this.chatPanel.style.display = 'none';
            this.toggleButton.style.display = 'block';
            this.isOpen = false;
        }

        // Public API methods
        open() {
            this.openChat();
        }

        close() {
            this.closeChat();
        }

        destroy() {
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            this.isInitialized = false;
        }

        updateConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
            // Recreate widget with new config
            if (this.isInitialized) {
                this.destroy();
                this.init();
            }
        }
    }

    // Global ChatKit object
    window.ChatKit = {
        init: (config) => {
            if (window.chatkitInstance) {
                window.chatkitInstance.destroy();
            }
            window.chatkitInstance = new ChatKitWidget(config);
            return window.chatkitInstance;
        },
        
        open: () => {
            if (window.chatkitInstance) {
                window.chatkitInstance.open();
            }
        },
        
        close: () => {
            if (window.chatkitInstance) {
                window.chatkitInstance.close();
            }
        },
        
        destroy: () => {
            if (window.chatkitInstance) {
                window.chatkitInstance.destroy();
                window.chatkitInstance = null;
            }
        }
    };

    // Auto-initialize if config is provided via data attributes
    document.addEventListener('DOMContentLoaded', () => {
        const script = document.querySelector('script[src*="chatkit-widget.js"]');
        if (script) {
            const config = {
                backendUrl: script.dataset.backendUrl,
                widgetTitle: script.dataset.widgetTitle,
                welcomeMessage: script.dataset.welcomeMessage,
                primaryColor: script.dataset.primaryColor,
                position: script.dataset.position
            };
            
            // Only auto-initialize if backendUrl is provided
            if (config.backendUrl) {
                window.ChatKit.init(config);
            }
        }
    });

})();
