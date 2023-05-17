console.log("ala")

const usernameText = document.querySelector("#usernameText"); //Texto del nombre de usuario

const socket = io();



document.addEventListener("DOMContentLoaded", () => {

    let room;

    let id;

    const modalUser = new bootstrap.Modal('#modalUser', {
        keyboard: false
    });
    
    // Nodo y event listener para abrir el modal de nuevo room
    const modalNewRoom = new bootstrap.Modal('#modalNewRoom', {
        keyboard: false
    });

    document.querySelector("#crearSalaButton").onclick = () => {
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
    socket.emit("tryNewRoom", roomName);
    //modalNewRoom.hide();
}