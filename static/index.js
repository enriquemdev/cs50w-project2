console.log("ala")

const usernameText = document.querySelector("#usernameText"); //Texto del nombre de usuario

const socket = io();





document.addEventListener("DOMContentLoaded", () => {
    //Variables /////////////////////////////////////////////////
    let room;

    let id;

    const modalUser = new bootstrap.Modal('#modalUser', {
        keyboard: false
    });
    
    // Nodo y event listener para abrir el modal de nuevo room
    const modalNewRoom = new bootstrap.Modal('#modalNewRoom', {
        keyboard: false
    });

    const roomsContainer = document.querySelector("#roomsContainer");

    const messagesContainer = document.querySelector("#messagesContainer"); //Contenedor de mensajes

    const room_title = document.querySelector("#room_title"); //Titulo de la sala
    //Functions //////////////////////////////////////////////////
    function envioModalUser() 
    {
        let username = document.querySelector("#username").value;
        if (username != "")
        {
            localStorage.setItem("fchat_user", username);
            usernameText.innerText = username;
            modalUser.hide();
        }
    }

    function getUsers()
    {
        socket.emit("getUsers");
    }

    function envioModalNewRoom() 
    {
        let roomName = document.querySelector("#roomName").value;
        //localStorage.setItem("fchat_user", username);
        //usernameText.innerText = username;

        if (roomName != "")
        {
            socket.emit("tryNewRoom", roomName, (res) => {
                //room = res;
                //console.log(res)
                if (res)
                {
                    modalNewRoom.hide();
                    document.querySelector("#roomName").value = "";
                    room = res;
                    room_title.innerText = room;
                    //updateRoomsList();
                    localStorage.setItem(("fchat_owner_"+res), 1);
                    alert(`Sala: ${res} creada con exito`);
                }
                else
                {
                    alert(`Ese nombre de sala ya esta ocupado, prueba con otro`);
                }
                // document.querySelector("#root").innerText = `Te has unido a la sala ${room}`;
                // document.querySelector("#root").innerHTML += "<br/>"
            });
        }
        
    }

    function updateRoomsList()
    {
        socket.emit("getRooms", (res) => {
            console.log(res);

            roomsContainer.innerHTML = "";

            for (let room of res) {
                //verificar si el usuario es el dueño de la sala
                let ownership = localStorage.getItem("fchat_owner_"+room['room_name']);

                //Crear el elemento de la sala
                roomElement = document.createElement("div");
                roomElement.classList.add("roomElement");
                //roomElement.id = "roomElement_"+room['room_name'];
                roomElement.setAttribute("roomName", room['room_name']);
                roomElement.innerHTML = `<h6>${room['room_name']}</h6>`;

                //Si es dueño, agregar el boton de eliminar
                if (ownership)
                {
                    roomElement.innerHTML =  `   
                            <h6 roomName="${room['room_name']}">${room['room_name']}</h6>
                            <button class="btn btn-danger delete_room" id="delete_room_${room['room_name']}">Eliminar sala</button>
                        `;
                }
                else
                {
                    roomElement.innerHTML = `<h6 roomName="${room['room_name']}">${room['room_name']}</h6>`;
                }
                roomsContainer.append(roomElement);
            }

            if (res.length > 0)
            {
                // roomsContainer.querySelector('div:first-child').classList.add("firstRoomElement");
                // roomsContainer.querySelector('div:last-child').classList.add("lastRoomElement");

                //Agregar event listener a los botones de eliminar
                const deleteRoomButtons = document.querySelectorAll(".delete_room");
                for (let button of deleteRoomButtons)
                {
                    button.onclick = (e) => {
                        deleteRoom(e.target.id);
                    };
                }

                //Agregar event listener a los elementos de sala (para entrar a la sala)
                const roomElements = document.querySelectorAll(".roomElement");
                for (let roomElement of roomElements)
                {
                    roomElement.onclick = (e) => {
                        if (!(e.target.classList.contains("delete_room")))
                        {
                            roomNameEnter = e.target.getAttribute("roomName");
                            enterRoom(roomNameEnter);
                        }          
                    };
                }
            }
        });
    } //fin updateRoomsList function

    function deleteRoom(idButton)
    {
        console.log(idButton);

        let roomNameDelete = idButton.replace("delete_room_", "");
        console.log(roomNameDelete);

        socket.emit("deleteRoom", roomNameDelete, (res) => {
            if (res)
            {
                localStorage.removeItem("fchat_owner_"+roomNameDelete);
                //updateRoomsList();
                alert(`Sala: ${roomNameDelete} eliminada con exito`);
                
            }
            else
            {
                alert(`No se pudo eliminar la sala :(`);
            }
            // document.querySelector("#root").innerText = `Te has unido a la sala ${room}`;
            // document.querySelector("#root").innerHTML += "<br/>"
        });
    }

    function sendMessage()
    {
        let message = document.querySelector("#chatInput").value;
        const user = localStorage.getItem("fchat_user");

        messageData = {
            "message": message,
            "room": room,
            "user": user,
            "datetime": new Date().toLocaleString()
        }
        console.log(messageData);

        if(message != "")
        {
            socket.emit("sendMessage", messageData, (res) => {
                if (!res)
                {
                    alert(`No se pudo enviar el mensaje :(`);
                }
            });
    
            document.querySelector("#chatInput").value = "";
        }   
    }

    function enterRoom(roomNameEnter)
    {
        //let roomNameEnter = idRoom.replace("roomElement_", "");
        socket.emit("enterRoom", roomNameEnter, (res) => {
            console.log(res);
            if (res)
            {
                room = roomNameEnter;
                room_title.innerText = room;
                alert(`Bienvenido a la sala: ${roomNameEnter}`);  
            }
            else
            {
                alert(`No se pudo ingresar a la sala :(`);
            }
        });
    }
    

    //Event Listeners /////////////////////////////////////////////////
    document.querySelector("#guardarUsernameButton").onclick = () => {
        envioModalUser();
    }

    document.querySelector("#getUsersButton").onclick = () => {
        getUsers();
    }

    document.querySelector("#modalCrearSalaButton").onclick = () => {
        modalNewRoom.show();
    }

    document.querySelector("#createRoomButton").onclick = () => {
        envioModalNewRoom();
    }

    document.querySelector("#sendMsgButton").onclick = () => {
        sendMessage();
    }

    document.querySelectorAll(".enter_send").forEach(item => {  
        item.addEventListener('keyup', event => {
            let flag = item.classList.contains("enter_send");
            if (event.key === 'Enter' && flag) {
                sendMessage();
            }
        })
    });
    
    ///////////////////////////////////////////////////

    // // const join_button = document.querySelector("#join");
    socket.on("meConnected", () => {    
        const user = localStorage.getItem("fchat_user");
        //Si el cliente no tiene usuario en localstorage
        if (!user) 
        {
            modalUser.show(); //Que ingrese uno
        }
        else
        {
            usernameText.innerText = user;
        }

        updateRoomsList();
    })

    socket.on("showUsers", (users) => {
        alert("users: "+users);
    })

    socket.on("user_disconnect", (user) => {
        alert(user +" disconnected ");
    })

    socket.on("mustUpdateRooms", () => {
        updateRoomsList();
    })

    socket.on("retrieveMessage", (messageData) => {
        console.log("new message ");
        console.log(messageData['message']);

        let elementoMsg = document.createElement("div");


        if (messageData['username'] == localStorage.getItem("fchat_user"))
        {
            elementoMsg.classList.add("messageElementMine");
        }
        else
        {
            elementoMsg.classList.add("messageElement");
        }

        elementoMsg.innerHTML = 
        `
            <div class="d-flex mb-2">
                <div class="flex-grow-1 me-3 msg_username">${messageData['username']}</div>
                <div class="msg_datetime">${messageData['datetime']}</div>
            </div>
            
            <div class="msg_text">${messageData['message']}</div>
        `;

        messagesContainer.append(elementoMsg);
    })
})