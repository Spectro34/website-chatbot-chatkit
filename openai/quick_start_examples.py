"""
Quick Start Examples for OpenAI SDK
==================================

These are practical, runnable examples you can try immediately.
Make sure you have your API key set: export OPENAI_API_KEY="your-key-here"
"""

from openai import OpenAI
import json

# Initialize client
client = OpenAI()

def example_1_simple_chat():
    """Basic chat completion - most common use case"""
    print("=== Example 1: Simple Chat ===")
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "Explain quantum computing in simple terms"}
        ],
        max_tokens=200
    )
    
    print(response.choices[0].message.content)
    print(f"Tokens used: {response.usage.total_tokens}")

def example_2_conversation():
    """Multi-turn conversation with context"""
    print("\n=== Example 2: Conversation ===")
    
    messages = [
        {"role": "system", "content": "You are a helpful coding tutor."},
        {"role": "user", "content": "I want to learn Python"},
        {"role": "assistant", "content": "Great! Python is an excellent language to learn. What would you like to start with - basics, data structures, or something specific?"},
        {"role": "user", "content": "What are the most important data structures?"}
    ]
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages,
        max_tokens=300
    )
    
    print(response.choices[0].message.content)

def example_3_code_generation():
    """Generate and explain code"""
    print("\n=== Example 3: Code Generation ===")
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "Write a Python function to sort a list of dictionaries by a specific key, and explain how it works"}
        ],
        max_tokens=400
    )
    
    print(response.choices[0].message.content)

def example_4_embeddings():
    """Create embeddings for similarity search"""
    print("\n=== Example 4: Embeddings ===")
    
    texts = [
        "The weather is sunny today",
        "It's raining heavily outside", 
        "The sun is shining brightly"
    ]
    
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    
    print(f"Created {len(response.data)} embeddings")
    print(f"Each embedding has {len(response.data[0].embedding)} dimensions")
    print(f"Cost: ${response.usage.total_tokens * 0.00002:.6f}")

def example_5_image_generation():
    """Generate an image with DALL-E"""
    print("\n=== Example 5: Image Generation ===")
    
    response = client.images.generate(
        model="dall-e-3",
        prompt="A cute robot reading a book in a cozy library",
        size="1024x1024",
        quality="standard",
        n=1
    )
    
    print(f"Image URL: {response.data[0].url}")
    print("Note: Image will be available for 1 hour")

def example_6_text_to_speech():
    """Convert text to speech"""
    print("\n=== Example 6: Text to Speech ===")
    
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input="Hello! This is a test of OpenAI's text-to-speech system. It sounds quite natural!"
    )
    
    # Save the audio file
    with open("speech_output.mp3", "wb") as f:
        f.write(response.content)
    
    print("Audio saved as 'speech_output.mp3'")

def example_7_streaming():
    """Stream responses for better user experience"""
    print("\n=== Example 7: Streaming Response ===")
    
    stream = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "Write a short story about a detective solving a mystery"}
        ],
        stream=True
    )
    
    print("Streaming response:")
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="", flush=True)
    print("\n")

def example_8_function_calling():
    """Use function calling for structured outputs"""
    print("\n=== Example 8: Function Calling ===")
    
    # Define a function the model can call
    functions = [
        {
            "name": "get_weather",
            "description": "Get weather information for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city name"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            }
        }
    ]
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "What's the weather like in Tokyo?"}
        ],
        functions=functions,
        function_call="auto"
    )
    
    message = response.choices[0].message
    print(f"Message: {message.content}")
    
    if message.function_call:
        print(f"Function to call: {message.function_call.name}")
        print(f"Arguments: {message.function_call.arguments}")

def example_9_moderation():
    """Check content for safety"""
    print("\n=== Example 9: Content Moderation ===")
    
    texts_to_check = [
        "I love this product! It's amazing.",
        "This is inappropriate content that should be flagged."
    ]
    
    for text in texts_to_check:
        response = client.moderations.create(input=text)
        result = response.results[0]
        print(f"Text: '{text}'")
        print(f"Flagged: {result.flagged}")
        print(f"Categories: {result.categories}")
        print()

def example_10_models_info():
    """Get information about available models"""
    print("\n=== Example 10: Available Models ===")
    
    models = client.models.list()
    
    # Show some popular models
    popular_models = ["gpt-4", "gpt-3.5-turbo", "text-embedding-3-small", "dall-e-3", "whisper-1"]
    
    for model in models.data:
        if model.id in popular_models:
            print(f"Model: {model.id}")
            print(f"  Created: {model.created}")
            print(f"  Owned by: {model.owned_by}")
            print()

def run_all_examples():
    """Run all examples"""
    print("OpenAI SDK Quick Start Examples")
    print("=" * 40)
    
    try:
        example_1_simple_chat()
        example_2_conversation()
        example_3_code_generation()
        example_4_embeddings()
        # example_5_image_generation()  # Uncomment to test image generation
        # example_6_text_to_speech()    # Uncomment to test TTS
        example_7_streaming()
        example_8_function_calling()
        example_9_moderation()
        example_10_models_info()
        
        print("\n" + "=" * 40)
        print("All examples completed successfully!")
        
    except Exception as e:
        print(f"Error running examples: {e}")
        print("Make sure you have set your OPENAI_API_KEY environment variable")

if __name__ == "__main__":
    run_all_examples()


