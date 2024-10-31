import os
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return "Welcome to the Chat Room!"

if __name__ == '__main__':
    # Use PORT environment variable, or default to 8000 for local testing
    port = int(os.environ.get("PORT", 8000))
    socketio.run(app, host='0.0.0.0', port=port)
