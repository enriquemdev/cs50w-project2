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


    //Functions //////////////////////////////////////////////////
    function envioModalUser() 
    {
        let username = document.querySelector("#username").value;
        localStorage.setItem("fchat_user", username);
        usernameText.innerText = username;
        modalUser.hide();
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
        socket.emit("tryNewRoom", roomName, (res) => {
            //room = res;
            //console.log(res)
            if (res)
            {
                modalNewRoom.hide();
                document.querySelector("#roomName").value = "";
                room = res;
                updateRoomsList();
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
                roomElement.innerHTML = `<h6>${room['room_name']}</h6>`;

                //Si es dueño, agregar el boton de eliminar
                if (ownership)
                {
                    roomElement.innerHTML =  `   
                            <h6>${room['room_name']}</h6>
                            <button class="btn btn-danger delete_room" id="delete_room_${room['room_name']}">Eliminar sala</button>
                        `;
                }
                else
                {
                    roomElement.innerHTML = `<h6>${room['room_name']}</h6>`;
                }
                roomsContainer.append(roomElement);
            }

            if (res)
            {
                roomsContainer.querySelector('div:first-child').classList.add("firstRoomElement");
                roomsContainer.querySelector('div:last-child').classList.add("lastRoomElement");
            }
            
            //Agregar event listener a los botones de eliminar
            const deleteRoomButtons = document.querySelectorAll(".delete_room");
            for (let button of deleteRoomButtons)
            {
                button.onclick = (e) => {
                    console.log(e.target.id);
                };
            }

        });
    } //fin updateRoomsList function

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

        // document.querySelector("#root").append(message);
        // document.querySelector("#root").innerHTML += "<br/>"
    })

    socket.on("showUsers", (users) => {
        alert("users: "+users);
    })

    socket.on("user_disconnect", (user) => {
        alert(user +" disconnected ");
    })

    // socket.on("userConnected", (message) => {
        

    //   id = message;
    //   //localStorage.setItem("userConnected", message);
    //   document.querySelector("#root").append(message);
    //   document.querySelector("#root").innerHTML += "<br/>"
    // })

    // // join_button.onclick = () => {
    // //   socket.emit("join_room", "WEB50", (res) => {
    // //     room = res;
    // //     document.querySelector("#root").innerText = `Te has unido a la sala ${room}`;
    // //     document.querySelector("#root").innerHTML += "<br/>"
    // //   });
    // // }

    // const send_message = document.querySelector("#send-message");

    // send_message.onclick = () => {
    //   const user = localStorage.getItem("userConnected");

    //   const message = document.querySelector("#message-input").value+" "+user;
    //   // console.log('test');

    //   console.log(message);

    //   socket.emit("message", message);
    //   document.querySelector("#message-input").value = '';

    // }

    // socket.on("message", data => {
    //   console.log(data);
    //   const html = `<div class="mensaje">${data}</div>`;

    //   document.querySelector("#root").innerHTML += html;
    //   //document.querySelector("#root").innerHTML += "<br/>";
    // })
})