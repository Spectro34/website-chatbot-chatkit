// ChatKit Integration for Sample Website
// This is a simplified integration example

// Configuration
const CHATKIT_CONFIG = {
    // You'll need to replace these with your actual values
    workflowId: 'your_workflow_id_here', // Replace with your ChatKit workflow ID
    apiKey: 'your_openai_api_key_here', // Replace with your OpenAI API key
    baseUrl: 'https://api.openai.com/v1', // OpenAI API base URL
};

// Chat state
let isChatOpen = false;
let chatContainer = null;

// Initialize ChatKit when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeChatKit();
});

function initializeChatKit() {
    // Create chat container
    chatContainer = document.getElementById('chatkit-container');
    
    // Create chat toggle button
    const chatButton = document.createElement('button');
    chatButton.className = 'chat-toggle';
    chatButton.innerHTML = '💬';
    chatButton.title = 'Open Chat';
    chatButton.onclick = toggleChat;
    
    chatContainer.appendChild(chatButton);
    
    // Create chat panel (simplified version)
    const chatPanel = document.createElement('div');
    chatPanel.id = 'chat-panel';
    chatPanel.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        display: none;
        flex-direction: column;
        z-index: 1001;
    `;
    
    // Create chat header
    const chatHeader = document.createElement('div');
    chatHeader.style.cssText = `
        background: #3498db;
        color: white;
        padding: 15px;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    chatHeader.innerHTML = `
        <h3 style="margin: 0; font-size: 1.1rem;">AI Assistant</h3>
        <button id="close-chat" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;">×</button>
    `;
    
    // Create chat messages area
    const chatMessages = document.createElement('div');
    chatMessages.id = 'chat-messages';
    chatMessages.style.cssText = `
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        background: #f8f9fa;
    `;
    
    // Create chat input area
    const chatInputArea = document.createElement('div');
    chatInputArea.style.cssText = `
        padding: 15px;
        border-top: 1px solid #e0e0e0;
        display: flex;
        gap: 10px;
    `;
    
    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.placeholder = 'Type your message...';
    chatInput.style.cssText = `
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 20px;
        outline: none;
    `;
    
    const sendButton = document.createElement('button');
    sendButton.innerHTML = 'Send';
    sendButton.style.cssText = `
        background: #3498db;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        cursor: pointer;
    `;
    
    chatInputArea.appendChild(chatInput);
    chatInputArea.appendChild(sendButton);
    
    // Assemble chat panel
    chatPanel.appendChild(chatHeader);
    chatPanel.appendChild(chatMessages);
    chatPanel.appendChild(chatInputArea);
    
    chatContainer.appendChild(chatPanel);
    
    // Add event listeners
    document.getElementById('close-chat').onclick = closeChat;
    sendButton.onclick = () => sendMessage(chatInput);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(chatInput);
        }
    });
    
    // Add welcome message
    addMessage('AI Assistant', 'Hello! How can I help you today?', 'bot');
}

function toggleChat() {
    const chatPanel = document.getElementById('chat-panel');
    const chatButton = document.querySelector('.chat-toggle');
    
    if (isChatOpen) {
        closeChat();
    } else {
        openChat();
    }
}

function openChat() {
    const chatPanel = document.getElementById('chat-panel');
    const chatButton = document.querySelector('.chat-toggle');
    
    chatPanel.style.display = 'flex';
    chatButton.innerHTML = '✕';
    chatButton.title = 'Close Chat';
    isChatOpen = true;
}

function closeChat() {
    const chatPanel = document.getElementById('chat-panel');
    const chatButton = document.querySelector('.chat-toggle');
    
    chatPanel.style.display = 'none';
    chatButton.innerHTML = '💬';
    chatButton.title = 'Open Chat';
    isChatOpen = false;
}

function addMessage(sender, message, type = 'user') {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    
    messageDiv.style.cssText = `
        margin-bottom: 15px;
        padding: 10px;
        border-radius: 10px;
        max-width: 80%;
        ${type === 'user' ? 
            'background: #3498db; color: white; margin-left: auto;' : 
            'background: white; color: #333; border: 1px solid #e0e0e0;'
        }
    `;
    
    messageDiv.innerHTML = `
        <div style="font-weight: bold; font-size: 0.9rem; margin-bottom: 5px;">${sender}</div>
        <div>${message}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage(inputElement) {
    const message = inputElement.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage('You', message, 'user');
    inputElement.value = '';
    
    // Show typing indicator
    addMessage('AI Assistant', 'Thinking...', 'bot');
    
    try {
        // Simulate API call (replace with actual ChatKit API call)
        const response = await simulateChatKitCall(message);
        
        // Remove typing indicator
        const messages = document.getElementById('chat-messages');
        messages.removeChild(messages.lastChild);
        
        // Add bot response
        addMessage('AI Assistant', response, 'bot');
        
    } catch (error) {
        // Remove typing indicator
        const messages = document.getElementById('chat-messages');
        messages.removeChild(messages.lastChild);
        
        // Add error message
        addMessage('AI Assistant', 'Sorry, I encountered an error. Please check your configuration and try again.', 'bot');
        console.error('ChatKit Error:', error);
    }
}

// Simulate ChatKit API call (replace with actual implementation)
async function simulateChatKitCall(message) {
    // This is a placeholder - you would replace this with actual ChatKit API calls
    // For now, it returns a simple response based on the message
    
    const responses = {
        'hello': 'Hello! How can I help you today?',
        'help': 'I can help you with various questions about our services, products, or general information. What would you like to know?',
        'services': 'We offer AI-powered customer support, information retrieval, and interactive experiences. Is there something specific you\'d like to know about?',
        'contact': 'You can reach us at contact@samplewebsite.com or call +1 (555) 123-4567. I\'m also here to help with any questions!',
        'default': 'I understand you\'re asking about "' + message + '". This is a demo response. In a real implementation, this would connect to OpenAI\'s ChatKit API.'
    };
    
    // Simple keyword matching (in real implementation, this would be handled by the AI)
    const lowerMessage = message.toLowerCase();
    
    for (const [keyword, response] of Object.entries(responses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }
    
    return responses.default;
}

// Function to open chat from CTA button
function openChat() {
    if (!isChatOpen) {
        toggleChat();
    }
}

// Export functions for global access
window.openChat = openChat;
window.toggleChat = toggleChat;
