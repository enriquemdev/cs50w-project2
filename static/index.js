console.log("ala")



document.addEventListener("DOMContentLoaded", () => {

    const socket = io();

    let room;

    let id;

    const modalUser = new bootstrap.Modal('#modali', {
        keyboard: false
    });

    function checkUsername()
    {
        const user = localStorage.getItem("fchat_user");

        //Si el cliente no tiene usuario en localstorage
        if (!user) 
        {
            //Que ingrese uno
            modalUser.show();
        }

        //Si ya está en localstorage, hay que guardarlo en el servidor (se verifica si existe en el servidor)
        //socket.emit("saveUser", user);
    }

    sGetUsers = () => {
        socket.emit("getUsers");
    }

    

    ///////////////////////////////////////////////////

    // // const join_button = document.querySelector("#join");
    socket.on("meConnected", () => {
        
        checkUsername();
        //   id = message;
        //   localStorage.setItem("userConnected", message);
        // document.querySelector("#root").append(message);
        // document.querySelector("#root").innerHTML += "<br/>"
    })

    // socket.on("userExists", (username) => {
    //     // alert("El usuario "+username+" está ocupado, por favor elija otro");
    //     console.log("El usuario "+username+" está ocupado, por favor elija otro");
    //     modalUser.show();
    //     // checkUser();   
    // })

    // socket.on("userSaved", (username) => {
    //     alert("El usuario "+username+" se ha conectado correctamente");
    // })

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

function envioModal() 
{
    let username = document.querySelector("#username").value;
    localStorage.setItem("fchat_user", username);
    modalUser.hide();
    //checkUsername();
}

function getUsers()
{
    sGetUsers();
}