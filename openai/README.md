# OpenAI SDK Complete Guide

This repository contains comprehensive examples and guides for using the OpenAI Python SDK.

## Quick Start

1. **Install the SDK:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set your API key:**
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```

3. **Run the examples:**
   ```bash
   python quick_start_examples.py
   ```

## Files Overview

### `quick_start_examples.py`
Ready-to-run examples demonstrating the most common OpenAI SDK features:
- Simple chat completions
- Multi-turn conversations
- Code generation
- Embeddings
- Image generation (DALL-E)
- Text-to-speech
- Streaming responses
- Function calling
- Content moderation
- Model information

### `openai_sdk_complete_guide.py`
Comprehensive guide covering all OpenAI SDK capabilities:
- Text completions (legacy)
- Chat completions
- Embeddings
- Image generation and editing
- Audio processing (speech-to-text, text-to-speech)
- File operations
- Assistants API
- Fine-tuning
- Moderation
- Models API
- Responses API (new)
- Usage and billing

### `example.py`
Your original example file (currently has an issue with the API call)

## Key Capabilities

### 1. **Text & Chat Completions**
- Generate text and have conversations
- Control creativity with temperature, top_p
- Use different models (GPT-4, GPT-3.5-turbo)
- Function calling for structured outputs
- Streaming for real-time responses

### 2. **Embeddings**
- Convert text to vector representations
- Useful for similarity search, clustering
- Multiple embedding models available

### 3. **Image Generation**
- DALL-E 2 and DALL-E 3
- Create images from text descriptions
- Image variations and editing

### 4. **Audio Processing**
- Speech-to-text (Whisper)
- Text-to-speech (TTS)
- Multiple voice options

### 5. **Assistants API**
- Create AI assistants with tools
- Code interpreter, function calling
- Persistent conversation threads

### 6. **File Operations**
- Upload and manage files
- Use files with Assistants API
- File search and retrieval

### 7. **Advanced Features**
- Fine-tuning for custom models
- Content moderation
- Usage monitoring
- Responses API for agentic applications

## Common Use Cases

1. **Chatbots & Conversational AI**
   - Customer support
   - Personal assistants
   - Educational tutors

2. **Content Generation**
   - Blog posts, articles
   - Code generation
   - Creative writing

3. **Data Analysis**
   - Text analysis
   - Similarity search
   - Classification

4. **Multimodal Applications**
   - Image generation
   - Audio processing
   - Document analysis

5. **Automation**
   - Function calling
   - Workflow automation
   - API integrations

## Best Practices

1. **Error Handling**
   - Always wrap API calls in try-catch
   - Handle rate limits and timeouts
   - Implement retry logic

2. **Cost Management**
   - Monitor token usage
   - Use appropriate models for tasks
   - Implement caching where possible

3. **Security**
   - Keep API keys secure
   - Use environment variables
   - Validate inputs

4. **Performance**
   - Use streaming for long responses
   - Implement proper rate limiting
   - Cache embeddings and responses

## Getting Help

- [OpenAI Documentation](https://platform.openai.com/docs)
- [OpenAI Python SDK Reference](https://github.com/openai/openai-python)
- [OpenAI Community Forum](https://community.openai.com/)

## Note on Your Current Example

Your `example.py` file has an issue - it's trying to use `client.responses.create()` with a model "gpt-5" which doesn't exist. The correct approach would be:

```python
from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4",  # or "gpt-3.5-turbo"
    messages=[
        {"role": "user", "content": "Write a one-sentence bedtime story about SRK from Bollywood."}
    ]
)

print(response.choices[0].message.content)
```

Run the examples to see the correct usage patterns!


