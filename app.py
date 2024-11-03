from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

users = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    for user_id, nickname in users.items():
        if nickname == users.get(request.sid):
            del users[user_id]
            emit('user_left', {'nickname': nickname}, broadcast=True)
            break

@socketio.on('join')
def handle_join(data):
    nickname = data['nickname']
    users[request.sid] = nickname
    join_room('chat')
    emit('user_joined', {'nickname': nickname}, room='chat')
    emit('update_users', {'users': list(users.values())}, room='chat')

@socketio.on('message')
def handle_message(data):
    nickname = users.get(request.sid, 'Anonymous')
    emit('message', {'nickname': nickname, 'message': data['message']}, room='chat')

if __name__ == '__main__':
    socketio.run(app, debug=True)