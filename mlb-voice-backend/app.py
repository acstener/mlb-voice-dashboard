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
                game_context = data.get("gameContext", {})
                logger.info(f"Received input: {text_input}")
                logger.debug(f"Game context: {game_context}")
                
                # Create a context-aware prompt
                current_play = game_context.get('currentPlay', {})
                plays = game_context.get('plays', [])
                latest_play = plays[0] if plays else None
                
                prompt = f"""You are a knowledgeable baseball expert and commentator. 

                Current game situation:
                - Home Team: {game_context.get('teams', {}).get('home', {}).get('team', {}).get('name', 'Unknown')}
                - Away Team: {game_context.get('teams', {}).get('away', {}).get('team', {}).get('name', 'Unknown')}
                - Home Score: {game_context.get('teams', {}).get('home', {}).get('score', 0)}
                - Away Score: {game_context.get('teams', {}).get('away', {}).get('score', 0)}
                - Inning: {current_play.get('inning', 1)} {current_play.get('inningHalf', 'top')}
                - Outs: {current_play.get('outs', 0)}
                - Count: {current_play.get('balls', 0)}-{current_play.get('strikes', 0)}
                
                Latest Play: {latest_play['description'] if latest_play else 'No plays yet'}

                Recent Play History:
                {chr(10).join([f"- {play['description']}" for play in plays[:3]]) if plays else "No plays yet"}
                
                The fan asks: {text_input}
                
                Please provide a clear, engaging explanation that helps a baseball beginner understand what's happening. 
                Include relevant context about the current game situation and explain any baseball terminology used.
                """
                
                # Send to Gemini
                logger.debug("Sending to Gemini...")
                response = session.generate_content(prompt)
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
