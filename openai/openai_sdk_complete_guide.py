"""
Complete OpenAI SDK Guide and Examples
=====================================

This comprehensive guide demonstrates all major capabilities of the OpenAI Python SDK.
Make sure to install the SDK first: pip install openai

Set your API key as an environment variable:
export OPENAI_API_KEY="your-api-key-here"

Or set it directly in the code (not recommended for production):
client = OpenAI(api_key="your-api-key-here")
"""

from openai import OpenAI
import json
import base64
import os
from typing import List, Dict, Any

# Initialize the OpenAI client
client = OpenAI()

class OpenAISDKGuide:
    """
    Comprehensive guide demonstrating all OpenAI SDK capabilities
    """
    
    def __init__(self):
        self.client = client
    
    # =============================================================================
    # 1. TEXT COMPLETIONS (Legacy but still supported)
    # =============================================================================
    
    def text_completions_example(self):
        """
        Generate text completions using the legacy completions API
        """
        print("=== TEXT COMPLETIONS ===")
        
        try:
            response = self.client.completions.create(
                model="gpt-3.5-turbo-instruct",
                prompt="Write a short story about a robot learning to paint:",
                max_tokens=150,
                temperature=0.7,
                top_p=1.0,
                frequency_penalty=0.0,
                presence_penalty=0.0
            )
            
            print("Generated text:")
            print(response.choices[0].text)
            print(f"Usage: {response.usage}")
            
        except Exception as e:
            print(f"Error in text completions: {e}")
    
    # =============================================================================
    # 2. CHAT COMPLETIONS (Most commonly used)
    # =============================================================================
    
    def chat_completions_example(self):
        """
        Generate chat completions with conversation context
        """
        print("\n=== CHAT COMPLETIONS ===")
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful coding assistant."},
                    {"role": "user", "content": "Explain the difference between Python lists and tuples."}
                ],
                max_tokens=300,
                temperature=0.7,
                top_p=1.0,
                frequency_penalty=0.0,
                presence_penalty=0.0
            )
            
            print("Assistant response:")
            print(response.choices[0].message.content)
            print(f"Usage: {response.usage}")
            
        except Exception as e:
            print(f"Error in chat completions: {e}")
    
    def chat_with_functions_example(self):
        """
        Chat completions with function calling capabilities
        """
        print("\n=== CHAT WITH FUNCTION CALLING ===")
        
        # Define functions that the model can call
        functions = [
            {
                "name": "get_weather",
                "description": "Get the current weather in a given location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA"
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
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "user", "content": "What's the weather like in New York?"}
                ],
                functions=functions,
                function_call="auto"
            )
            
            message = response.choices[0].message
            print("Message content:", message.content)
            
            if message.function_call:
                print("Function call detected:")
                print(f"Function: {message.function_call.name}")
                print(f"Arguments: {message.function_call.arguments}")
            
        except Exception as e:
            print(f"Error in chat with functions: {e}")
    
    # =============================================================================
    # 3. EMBEDDINGS
    # =============================================================================
    
    def embeddings_example(self):
        """
        Generate embeddings for text
        """
        print("\n=== EMBEDDINGS ===")
        
        try:
            response = self.client.embeddings.create(
                model="text-embedding-3-small",
                input="The quick brown fox jumps over the lazy dog"
            )
            
            embedding = response.data[0].embedding
            print(f"Embedding dimension: {len(embedding)}")
            print(f"First 10 values: {embedding[:10]}")
            print(f"Usage: {response.usage}")
            
        except Exception as e:
            print(f"Error in embeddings: {e}")
    
    def batch_embeddings_example(self):
        """
        Generate embeddings for multiple texts
        """
        print("\n=== BATCH EMBEDDINGS ===")
        
        texts = [
            "Machine learning is fascinating",
            "Python is a great programming language",
            "OpenAI provides powerful AI models"
        ]
        
        try:
            response = self.client.embeddings.create(
                model="text-embedding-3-small",
                input=texts
            )
            
            print(f"Generated {len(response.data)} embeddings")
            for i, embedding in enumerate(response.data):
                print(f"Text {i+1} embedding dimension: {len(embedding.embedding)}")
            
        except Exception as e:
            print(f"Error in batch embeddings: {e}")
    
    # =============================================================================
    # 4. IMAGE GENERATION
    # =============================================================================
    
    def image_generation_example(self):
        """
        Generate images using DALL-E
        """
        print("\n=== IMAGE GENERATION ===")
        
        try:
            response = self.client.images.generate(
                model="dall-e-3",
                prompt="A futuristic cityscape with flying cars and neon lights",
                size="1024x1024",
                quality="standard",
                n=1
            )
            
            image_url = response.data[0].url
            print(f"Generated image URL: {image_url}")
            print("Note: The image is available for 1 hour at this URL")
            
        except Exception as e:
            print(f"Error in image generation: {e}")
    
    def image_variation_example(self):
        """
        Create variations of an existing image
        """
        print("\n=== IMAGE VARIATIONS ===")
        
        # Note: This requires an existing image file
        # For demonstration, we'll show the structure
        print("To create image variations, you would use:")
        print("""
        with open("path/to/image.png", "rb") as image_file:
            response = client.images.create_variation(
                image=image_file,
                n=1,
                size="1024x1024"
            )
        """)
    
    # =============================================================================
    # 5. AUDIO PROCESSING
    # =============================================================================
    
    def speech_to_text_example(self):
        """
        Convert speech to text using Whisper
        """
        print("\n=== SPEECH TO TEXT ===")
        
        # Note: This requires an audio file
        print("To convert speech to text, you would use:")
        print("""
        with open("path/to/audio.mp3", "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
        """)
    
    def text_to_speech_example(self):
        """
        Convert text to speech using TTS
        """
        print("\n=== TEXT TO SPEECH ===")
        
        try:
            response = self.client.audio.speech.create(
                model="tts-1",
                voice="alloy",
                input="Hello, this is a test of OpenAI's text-to-speech system."
            )
            
            # Save the audio file
            with open("output_speech.mp3", "wb") as f:
                f.write(response.content)
            
            print("Audio file saved as 'output_speech.mp3'")
            
        except Exception as e:
            print(f"Error in text-to-speech: {e}")
    
    # =============================================================================
    # 6. FILE OPERATIONS
    # =============================================================================
    
    def file_operations_example(self):
        """
        Upload, list, and manage files
        """
        print("\n=== FILE OPERATIONS ===")
        
        # Create a sample file for upload
        sample_content = "This is a sample file for OpenAI file operations."
        with open("sample_file.txt", "w") as f:
            f.write(sample_content)
        
        try:
            # Upload file
            with open("sample_file.txt", "rb") as f:
                uploaded_file = self.client.files.create(
                    file=f,
                    purpose="assistants"
                )
            
            print(f"File uploaded with ID: {uploaded_file.id}")
            
            # List files
            files = self.client.files.list()
            print(f"Total files: {len(files.data)}")
            
            # Get file details
            file_details = self.client.files.retrieve(uploaded_file.id)
            print(f"File name: {file_details.filename}")
            print(f"File size: {file_details.bytes} bytes")
            
            # Clean up
            self.client.files.delete(uploaded_file.id)
            print("File deleted successfully")
            
        except Exception as e:
            print(f"Error in file operations: {e}")
        finally:
            # Clean up local file
            if os.path.exists("sample_file.txt"):
                os.remove("sample_file.txt")
    
    # =============================================================================
    # 7. ASSISTANTS API
    # =============================================================================
    
    def assistants_example(self):
        """
        Create and use assistants
        """
        print("\n=== ASSISTANTS API ===")
        
        try:
            # Create an assistant
            assistant = self.client.beta.assistants.create(
                name="Math Tutor",
                instructions="You are a helpful math tutor. Explain concepts clearly and provide examples.",
                model="gpt-4",
                tools=[{"type": "code_interpreter"}]
            )
            
            print(f"Assistant created with ID: {assistant.id}")
            
            # Create a thread
            thread = self.client.beta.threads.create()
            print(f"Thread created with ID: {thread.id}")
            
            # Add a message to the thread
            message = self.client.beta.threads.messages.create(
                thread_id=thread.id,
                role="user",
                content="Explain calculus derivatives with examples"
            )
            
            # Run the assistant
            run = self.client.beta.threads.runs.create(
                thread_id=thread.id,
                assistant_id=assistant.id
            )
            
            print(f"Run started with ID: {run.id}")
            print("Note: In a real application, you would poll for completion")
            
            # Clean up
            self.client.beta.assistants.delete(assistant.id)
            print("Assistant deleted")
            
        except Exception as e:
            print(f"Error in assistants: {e}")
    
    # =============================================================================
    # 8. FINE-TUNING
    # =============================================================================
    
    def fine_tuning_example(self):
        """
        Fine-tune models (demonstration of structure)
        """
        print("\n=== FINE-TUNING ===")
        
        print("Fine-tuning process:")
        print("1. Prepare training data in JSONL format")
        print("2. Upload training file")
        print("3. Create fine-tuning job")
        print("4. Monitor job status")
        print("5. Use fine-tuned model")
        
        print("""
        # Example structure:
        
        # Upload training file
        training_file = client.files.create(
            file=open("training_data.jsonl", "rb"),
            purpose="fine-tune"
        )
        
        # Create fine-tuning job
        fine_tuning_job = client.fine_tuning.jobs.create(
            training_file=training_file.id,
            model="gpt-3.5-turbo"
        )
        
        # Check job status
        job_status = client.fine_tuning.jobs.retrieve(fine_tuning_job.id)
        """)
    
    # =============================================================================
    # 9. MODERATION
    # =============================================================================
    
    def moderation_example(self):
        """
        Check content for policy violations
        """
        print("\n=== MODERATION ===")
        
        try:
            response = self.client.moderations.create(
                input="I love this product! It's amazing and works perfectly."
            )
            
            result = response.results[0]
            print(f"Flagged: {result.flagged}")
            print(f"Categories: {result.categories}")
            print(f"Category scores: {result.category_scores}")
            
        except Exception as e:
            print(f"Error in moderation: {e}")
    
    # =============================================================================
    # 10. MODELS API
    # =============================================================================
    
    def models_example(self):
        """
        List and retrieve model information
        """
        print("\n=== MODELS API ===")
        
        try:
            # List all models
            models = self.client.models.list()
            print(f"Total models available: {len(models.data)}")
            
            # Show some popular models
            popular_models = ["gpt-4", "gpt-3.5-turbo", "text-embedding-3-small", "dall-e-3"]
            for model in models.data:
                if model.id in popular_models:
                    print(f"Model: {model.id} - Created: {model.created}")
            
            # Get specific model details
            gpt4_model = self.client.models.retrieve("gpt-4")
            print(f"\nGPT-4 details:")
            print(f"ID: {gpt4_model.id}")
            print(f"Owned by: {gpt4_model.owned_by}")
            print(f"Created: {gpt4_model.created}")
            
        except Exception as e:
            print(f"Error in models API: {e}")
    
    # =============================================================================
    # 11. RESPONSES API (New)
    # =============================================================================
    
    def responses_api_example(self):
        """
        Use the new Responses API for agentic applications
        """
        print("\n=== RESPONSES API ===")
        
        try:
            response = self.client.responses.create(
                model="gpt-4",
                input="What's the latest news about artificial intelligence?",
                tools=["web_search"]  # Built-in tools
            )
            
            print("Response from Responses API:")
            print(response.output_text)
            
        except Exception as e:
            print(f"Error in Responses API: {e}")
    
    # =============================================================================
    # 12. USAGE AND BILLING
    # =============================================================================
    
    def usage_example(self):
        """
        Check API usage and billing
        """
        print("\n=== USAGE AND BILLING ===")
        
        print("To check usage, you would typically:")
        print("1. Monitor usage in the OpenAI dashboard")
        print("2. Set up usage alerts")
        print("3. Implement rate limiting in your application")
        print("4. Use the usage API endpoints when available")
    
    # =============================================================================
    # UTILITY METHODS
    # =============================================================================
    
    def run_all_examples(self):
        """
        Run all examples to demonstrate the complete SDK
        """
        print("OpenAI SDK Complete Guide")
        print("=" * 50)
        
        # Run all examples
        self.text_completions_example()
        self.chat_completions_example()
        self.chat_with_functions_example()
        self.embeddings_example()
        self.batch_embeddings_example()
        self.image_generation_example()
        self.image_variation_example()
        self.speech_to_text_example()
        self.text_to_speech_example()
        self.file_operations_example()
        self.assistants_example()
        self.fine_tuning_example()
        self.moderation_example()
        self.models_example()
        self.responses_api_example()
        self.usage_example()
        
        print("\n" + "=" * 50)
        print("All examples completed!")

# =============================================================================
# ADDITIONAL HELPER FUNCTIONS
# =============================================================================

def create_conversation_context():
    """
    Example of maintaining conversation context
    """
    print("\n=== CONVERSATION CONTEXT EXAMPLE ===")
    
    conversation_history = []
    
    def chat_with_context(user_message: str):
        conversation_history.append({"role": "user", "content": user_message})
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=conversation_history,
            max_tokens=150
        )
        
        assistant_message = response.choices[0].message.content
        conversation_history.append({"role": "assistant", "content": assistant_message})
        
        return assistant_message
    
    # Example conversation
    print("User: Hello, I'm learning Python")
    response1 = chat_with_context("Hello, I'm learning Python")
    print(f"Assistant: {response1}")
    
    print("User: What should I focus on first?")
    response2 = chat_with_context("What should I focus on first?")
    print(f"Assistant: {response2}")

def streaming_example():
    """
    Example of streaming responses
    """
    print("\n=== STREAMING EXAMPLE ===")
    
    try:
        stream = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "Write a short poem about coding"}],
            stream=True
        )
        
        print("Streaming response:")
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                print(chunk.choices[0].delta.content, end="")
        print("\n")
        
    except Exception as e:
        print(f"Error in streaming: {e}")

def error_handling_example():
    """
    Example of proper error handling
    """
    print("\n=== ERROR HANDLING EXAMPLE ===")
    
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=50
        )
        print("Success!")
        
    except client.APIError as e:
        print(f"API Error: {e}")
    except client.RateLimitError as e:
        print(f"Rate limit exceeded: {e}")
    except client.APITimeoutError as e:
        print(f"Request timed out: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

# =============================================================================
# MAIN EXECUTION
# =============================================================================

if __name__ == "__main__":
    # Create guide instance
    guide = OpenAISDKGuide()
    
    # Run all examples
    guide.run_all_examples()
    
    # Run additional examples
    create_conversation_context()
    streaming_example()
    error_handling_example()
    
    print("\n" + "=" * 60)
    print("COMPLETE OPENAI SDK CAPABILITIES SUMMARY")
    print("=" * 60)
    print("""
    The OpenAI SDK provides access to:

    1. TEXT COMPLETIONS
       - Generate text from prompts
       - Control creativity with temperature, top_p
       - Legacy but still supported

    2. CHAT COMPLETIONS (Most Popular)
       - Conversational AI with context
       - Function calling capabilities
       - Streaming responses
       - Multiple models (GPT-4, GPT-3.5-turbo)

    3. EMBEDDINGS
       - Convert text to vector representations
       - Useful for similarity search, clustering
       - Multiple embedding models available

    4. IMAGE GENERATION
       - DALL-E 2 and DALL-E 3
       - Create images from text descriptions
       - Image variations and editing

    5. AUDIO PROCESSING
       - Speech-to-text (Whisper)
       - Text-to-speech (TTS)
       - Multiple voice options

    6. FILE OPERATIONS
       - Upload and manage files
       - Use files with Assistants API
       - File search and retrieval

    7. ASSISTANTS API
       - Create AI assistants with tools
       - Code interpreter, function calling
       - Persistent conversation threads

    8. FINE-TUNING
       - Customize models for specific tasks
       - Upload training data
       - Create specialized models

    9. MODERATION
       - Content safety checking
       - Policy violation detection
       - Safe AI applications

    10. MODELS API
        - List available models
        - Get model information
        - Check capabilities

    11. RESPONSES API (New)
        - Agentic applications
        - Built-in tools (web search, etc.)
        - Simplified agent development

    12. USAGE & BILLING
        - Monitor API usage
        - Set up alerts
        - Cost management

    BEST PRACTICES:
    - Always handle errors gracefully
    - Use appropriate models for your use case
    - Implement rate limiting
    - Monitor usage and costs
    - Keep API keys secure
    - Use streaming for better UX
    - Maintain conversation context
    - Validate inputs before sending to API
    """)


