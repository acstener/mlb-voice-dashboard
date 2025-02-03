from dotenv import load_dotenv
import os
import asyncio
import json
import logging
import websockets
import google.generativeai as genai
import traceback

# Load environment variables
load_dotenv()
logger = logging.getLogger(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Initialize Gemini client
try:
    genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
    client = genai
    logger.info("Successfully initialized Gemini client")
except Exception as e:
    logger.error(f"Failed to initialize Gemini client: {e}")
    logger.error(traceback.format_exc())

MODEL_ID = "gemini-pro"

async def handle_client(websocket):
    """Handle WebSocket connection for text interaction."""
    try:
        logger.info(f"New client connected from {websocket.remote_address}")
        
        # Test Gemini connection immediately
        try:
            session = genai.GenerativeModel(MODEL_ID)
            test_response = session.generate_content("test")
            logger.info("Gemini connection test successful")
        except Exception as e:
            logger.error(f"Failed to create Gemini session: {e}")
            logger.error(traceback.format_exc())
            await websocket.close()
            return
        
        async for message in websocket:
            try:
                # Log raw message
                logger.debug(f"Raw message received: {message}")
                
                # Parse the incoming message
                data = json.loads(message)
                text_input = data.get("content", "")
                logger.info(f"Received input: {text_input}")
                
                # Send to Gemini
                logger.debug("Sending to Gemini...")
                response = session.generate_content(text_input)
                logger.debug(f"Received response from Gemini: {response.text}")
                
                # Send response back to client
                await websocket.send(json.dumps({
                    "type": "text",
                    "content": response.text
                }))
                logger.info("Response sent to client")
                
            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error: {e}")
                await websocket.send(json.dumps({
                    "type": "error",
                    "content": "Invalid message format"
                }))
            except Exception as e:
                logger.error(f"Error processing message: {e}")
                logger.error(traceback.format_exc())
                await websocket.send(json.dumps({
                    "type": "error",
                    "content": str(e)
                }))
    except websockets.exceptions.ConnectionClosed:
        logger.info("Client disconnected normally")
    except Exception as e:
        logger.error(f"Session error: {e}")
        logger.error(traceback.format_exc())
    finally:
        logger.info("WebSocket connection closed")

async def start_server():
    """Start the WebSocket server."""
    port = 8765  # Using consistent port 8765
    host = "localhost"
    logger.info(f"Starting WebSocket server on ws://{host}:{port}")
    
    try:
        async with websockets.serve(handle_client, host, port):
            logger.info(f"WebSocket server is running!")
            await asyncio.Future()  # run forever
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        logger.error(traceback.format_exc())

if __name__ == "__main__":
    logger.info("Starting application...")
    asyncio.run(start_server())
