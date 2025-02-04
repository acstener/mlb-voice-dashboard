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
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
    datefmt='%H:%M:%S'
)

# Disable websockets debug logging
logging.getLogger('websockets').setLevel(logging.WARNING)

# Initialize Gemini client
try:
    genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
    client = genai
    logger.info("Successfully initialized Gemini client")
except Exception as e:
    logger.error(f"Failed to initialize Gemini client: {e}")
    logger.error(traceback.format_exc())

MODEL_ID = "gemini-pro"

# Initialize chat session
chat_session = None

async def explain_baseball_play(play_description: str, play_type: str = None) -> str:
    """Get an AI-powered explanation of a baseball play."""
    global chat_session
    
    try:
        # Initialize chat session if needed
        if not chat_session:
            model = genai.GenerativeModel('gemini-pro')
            chat_session = model.start_chat(
                history=[
                    {
                        "role": "user",
                        "parts": ["You are a friendly baseball companion helping new fans understand the game. Your responses should be conversational and easy to understand, as if explaining to someone at their first game. Start with a brief title that captures the moment (e.g. *Exciting Double Play!*), then explain what happened and why it matters in simple terms. Avoid technical jargon unless necessary, and when you use baseball terms, briefly explain them naturally within your response."]
                    },
                    {
                        "role": "model",
                        "parts": ["I'll help fans understand and enjoy baseball by explaining plays in a friendly, accessible way, focusing on what makes each moment exciting or important."]
                    }
                ]
            )
        
        # Craft a more contextual prompt
        prompt = f"Analyze this play (start with italic title, then 2-3 sentences): {play_description}"
        
        # Get an engaging response with higher creativity
        response = chat_session.send_message(
            prompt,
            generation_config={
                "temperature": 0.8,  # More creative and varied
                "max_output_tokens": 75,  # Room for richer analysis
                "candidate_count": 1,
                "top_p": 0.9  # More expressive language
            }
        )
        
        return response.text
    except Exception as e:
        logger.error(f"Failed to get AI baseball analysis: {e}")
        return "AI analysis unavailable at this time."

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
                message_type = data.get("type", "")
                
                if message_type == "explain_play":
                    play_description = data.get("content", "")
                    play_type = data.get("play_type", "")
                    explanation = await explain_baseball_play(play_description, play_type)
                    await websocket.send(json.dumps({
                        "type": "explanation",
                        "content": explanation
                    }))
                    continue
                
                text_input = data.get("content", "")
                game_context = data.get("gameContext", {})
                logger.info(f"Received input: {text_input}")
                logger.debug(f"Game context: {game_context}")
                
                # Create a context-aware prompt
                current_play = game_context.get('currentPlay', {})
                plays = game_context.get('plays', [])
                latest_play = plays[0] if plays else None
                
                prompt = f"""You are a friendly and knowledgeable baseball companion, helping new fans understand and enjoy the game. Think of yourself as sitting next to them at their first baseball game, ready to explain things in simple terms.

                Current Game Context:
                {game_context.get('teams', {}).get('home', {}).get('team', {}).get('name', 'Unknown')} vs {game_context.get('teams', {}).get('away', {}).get('team', {}).get('name', 'Unknown')}
                Score: {game_context.get('teams', {}).get('home', {}).get('score', 0)} - {game_context.get('teams', {}).get('away', {}).get('score', 0)}
                We're in the {current_play.get('inningHalf', 'top')} of inning {current_play.get('inning', 1)}
                Current situation: {current_play.get('outs', 0)} out(s), count is {current_play.get('balls', 0)}-{current_play.get('strikes', 0)}
                
                What just happened: {latest_play['description'] if latest_play else 'The game is just getting started'}

                Recent key moments:
                {chr(10).join([f"- {play['description']}" for play in plays[:3]]) if plays else "No plays yet"}
                
                The fan asks: {text_input}
                
                Guidelines for your response:
                1. Be extremely concise - use at most 1-2 short sentences
                2. Focus on what's most important right now
                3. Only explain baseball terms if specifically asked
                4. Keep it casual and friendly, but brief
                5. For greetings or general statements, use just one short sentence
                
                Remember: Your goal is to help them enjoy and understand baseball, not overwhelm them with stats or technical details.
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
