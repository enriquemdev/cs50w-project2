import os

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
# app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

socketio = SocketIO(app, cors_allowed_origins="*")
clients_arr = []


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