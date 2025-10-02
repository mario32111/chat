const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const axios = require('axios');
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:8080", "http://localhost:8081"],

        methods: ["GET", "POST"]
    }
});

const EXPRESS_API_URL = 'http://localhost:3000/saveMessage';


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', async (data) => {
        console.log('message: ' + data);
        try {
            const response = await axios.post(EXPRESS_API_URL, {
                userName: data.userName,
                message: data.message
            });

            if (response.status === 201) {
                console.log(`✅ Mensaje de Marito11 enviado a Express (3000) y guardado en Firestore. Resp: ${response.data}`);
                console.log(data)
                io.emit('chat message', data); // Enviar a todos los clientes conectados
            } else {
                // Axios arroja un error para respuestas 4xx o 5xx, pero es bueno manejarlo
                console.error(`❌ Express respondió con estado inesperado: ${response.status}`);
                socket.emit('chat message', 'Error al guardar en DB\n');
            }
        } catch (error) {
            // Manejar errores de conexión (servidor Express caído) o errores de respuesta 4xx/5xx
            console.error('❌ Error al llamar al Servidor Express:', error.message);

            // Si el error tiene una respuesta (ej. 400/500), podemos loguear los datos
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
            }
            socket.emit('error message', 'Error de conexión con API\n');
        }
    });
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});

module.exports = { server };