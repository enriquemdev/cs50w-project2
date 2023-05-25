# Project 2

Web Programming with Python and JavaScript

Nombre: Enrique Muñoz

En este proyecto de FLack, hice un diseño de un chat en linea un poco parecido a whatsapp web, dandole toques personales por todos lados con Flask, Javascript y la librería de socket IO para ambas tecnologías. Bootstrap y CSS para el frontend design.

De fondo principal tenemos un gradiente con colores llamativos
Luego tenemos 2 grandes contenedores, la barra lateral izquierda que da informacion del usuario, los controles para crear salas y la lista de salas completa, a las que se puede dar click para entrar.
Como segundo contenedor en si es el chat Container que tiene 2 barras una arriba y una abajo, la de arriba muestra el nombre de la sala y la de abajo es el campo de texto y el boton para enviar los mensajes. En medio de ambas barras se muestra el contenedor mas importante, el de los mensajes, que mostrara ordenadamente todos los mensajes que se encuentren en tu canal actual.

Como extra, se pueden enviar los mensajes al presionar enter.

Como principales caracteristicas tenemos:
- Agregar Nombre: Si es primera vez que se ingresa a la pagina se muestra un modal que solicita tu nombre.
- Nombre Visual: Se puede ver el nombre ingresado en el modal anterior.
- Creación de Canal: Se pueden crear canales mediante el boton de Crear canales en la seccion de controles, este muestra un modal que pide el nombre unico del canal nuevo.
- Lista de Canales: Todos los canales agregados son listados en la siguiente seccion de la barra lateral izquierda, al darles click se ingresara al canal, lo que permitira enviar mensajes al mismo, y se cargaran los mensajes guardados con anterioridad en este.
- Envío de Mensajes: Cuando un usuario envía un mensaje, su nombre visible y la marca de tiempo del mensaje se muestran en el contenedor de mensajes, salen al lado izquierdo si es un mensaje que no eres tu, y al lado derecho si tu enviaste ese mensaje.
- Si se esta al final del scroll del contenedor del chat, se baja automaticamente para leer los ultimos mensajes recibidos.
- Recordar el Canal: Se guarda en local storage el ultimo canal visitado, que se tratara de cargar automaticamente si se vuelve a ingresar a la pagina web.
- Toque Personal: Mi toque personal es darle la capacidad a los usuarios de eliminar las salas que ellos mismos hayan creado, esto lo hago mediante la creacion de una key en el local storage al cliente que haya creado la sala. Si este la creo aparece un boton que le permite borrarla.
- Notificaciones con toasts, el feedback y notificaciones de acciones realizadas se hace mendiante toasts de bootstrap para una mejor experiencia de usuario.

Notas:
- Hice scrolleable ambos contenedores principales con css, ademas modifique los estilos de los scrollbars para que combinaran con el estilo de la pagina, en un css aparte scrollbar.css.
- Los archivos de codigo principales son 3: 
    - application.py 
    - index.js
    - index.html