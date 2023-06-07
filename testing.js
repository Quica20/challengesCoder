const socket = io();

const input = document.getElementById("textbox");
const texto = document.getElementById("texto");

input.addEventListener("keyup", (evt) => {
    if (evt.key === "Enter") {
        socket.emit("message", input.value);
        input.value == "";
    }
});

socket.on("imprimir", (data) => {
    let mensajes = ''
    data.forEach(msj => {
        mensajes += `${msj.socketId} escribio: ${msj.message} <br/>`
    })
    texto.innerHTML = mensajes
});

import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.routes.js';
import { Server } from 'socket.io'; //Primer paso

const app = express();

app.use(express.static(__dirname + '/public'))
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);

const expressServer = app.listen(8080, () => console.log("Listening")) //Segundo
const socketServer = new Server(expressServer) // Tercer paso

const mensajes = []

socketServer.on('connection', (socket) => {
    console.log('connected')

    socket.on('message', (data) => {
        mensajes.pusch({ socketId: socket.id, message: data })
        socketServer.emit('imprimir', mensajes)
    })
});