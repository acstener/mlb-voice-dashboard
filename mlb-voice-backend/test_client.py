import asyncio
import websockets
import json

async def test_gemini():
    uri = "ws://localhost:8000"
    async with websockets.connect(uri) as websocket:
        # Test message
        message = {
            "content": "Hello! Can you tell me about baseball?"
        }
        
        print(f"Sending: {message}")
        await websocket.send(json.dumps(message))
        
        response = await websocket.recv()
        print(f"Received: {json.loads(response)}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
