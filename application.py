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
    emit('meConnected', broadcast=False, include_self=True)
    
@socketio.on("saveUser") 
def saveUser(username):
    global clients_arr
    
    if username in clients_arr:
        return False     
    else:
        clients_arr.append(username)
        return True
        # emit("userSaved", username, broadcast=False, include_self=True)
        
        
@socketio.on("getUsers") 
def getUsers():
    global clients_arr
    emit("showUsers", clients_arr, broadcast=False, include_self=True)
     
    
@socketio.on('tryNewRoom')
def tryNewRoom(roomName):
    global rooms
    
    new_room = {
        "room_name": roomName,
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
        emit('mustUpdateRooms', broadcast=True, include_self=True)
    else:
        success = False

    return success
    

@socketio.on("getRooms") 
def getRooms():
    global rooms
    return rooms


@socketio.on("deleteRoom") 
def deleteRoom(roomNameDelete):
    global rooms
    
    flag = False
    for room in rooms:
        # Si la clave room_name existe y si el roomName es el que recibe la función
        if 'room_name' in room and room['room_name'] == roomNameDelete:
            rooms.remove(room)
            flag = True
            emit('roomDeleted', broadcast=False, include_self=True, to=roomNameDelete)
            emit('mustUpdateRooms', broadcast=True, include_self=True)
    return flag


@socketio.on("sendMessage") 
def getRooms(messageData):
    global rooms
    
    mensajeNuevo = {
        "username": messageData['user'],
        "message": messageData['message'],
        "datetime": messageData['datetime']
    }
    
    flag = False
    for room in rooms:
        if 'room' in messageData:
            # Si la clave room_name existe y si el roomName del room es la clave room del messageData
            if 'room_name' in room and room['room_name'] == messageData['room']:
                
                if (len(room['messages']) >= 100):
                    room['messages'].pop(0)
                    
                room['messages'].append(mensajeNuevo)
                flag = True
                emit("retrieveMessage", mensajeNuevo, broadcast=False, include_self=True, to=messageData['room'])
    return flag

@socketio.on("enterRoom") 
def enterRoom(roomNameEnter, roomNameLeave):
    global rooms
    
    flag = {
        'status': False,
    }
    print(roomNameEnter+" hola si")
    for room in rooms:
        # Si la clave room_name existe y si el roomName es el que recibe la función
        if 'room_name' in room and room['room_name'] == roomNameEnter:
            print(room['room_name'], roomNameEnter)
            
            if roomNameLeave != None and roomNameLeave != '':
                leave_room(roomNameLeave)
                print('old room '+roomNameLeave)
            else:
                print('no old room ')
                 
            flag = {
                'status': True,
                'data': room['messages']
            }
            join_room(roomNameEnter)
            
    print(flag)
    return flag