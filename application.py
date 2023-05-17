import os

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
# app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

socketio = SocketIO(app, cors_allowed_origins="*")
clients_arr = []
rooms = []


@app.route("/")
def index():
    return render_template("index.html")


@socketio.on('connect')
def connect():
    global clients_arr
    clients_arr.append(request.sid)
    # emit('userConnected', len(clients_arr), broadcast=True, include_self=False)
    emit('meConnected', broadcast=False, include_self=True)
    
    
# @socketio.on("saveUser") 
# def saveUser(username):
#     global clients_arr
#     if username in clients_arr:
#         emit("userExists", username, broadcast=False, include_self=True)
#     else:

#         clients_arr.append(username)
#         emit("userSaved", username, broadcast=False, include_self=True)
        
        
@socketio.on("getUsers") 
def getUsers():
    global clients_arr
    emit("showUsers", clients_arr, broadcast=False, include_self=True)
    
    
@socketio.on('disconnect')
def disconnect():
    global clients_arr
    clients_arr.remove(request.sid)
    emit("user_disconnect", request.sid, broadcast=True, include_self=False)
    
    
@socketio.on('tryNewRoom')
def tryNewRoom(roomName):
    global rooms
    
    new_room = {
        "room_name": roomName,
        "client_count": 1,
        "messages": []
    }
    # flag tells you if the room already exists
    flag = False
    
    for room in rooms:
        if 'room_name' in room and room['room_name'] == roomName:
            flag = True

    if flag == False:
        rooms.append(new_room)
        join_room(new_room["room_name"])
        success = new_room["room_name"]
    else:
        success = False

    return success
    