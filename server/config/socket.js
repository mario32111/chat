const net = require ('net');

//cada conexion que se tenga a este servidor se cierra automaticamente

const server = net.createServer();
const EXPRESS_API_URL = 'http://localhost:3000/saveMessage';
const axios = require('axios');
//al estar basado en tcp se envia una confirmacion de recibido
//si hay una conexion al server
server.on('connection', (socket) =>{
    //este evento se ejecuta cada vez que un cliente se conecta
    //al usarlo por segunda vez despliega un string
    //si hay una conexion al socket hace esto
    socket.on('data', async (data)=>{
        console.log('Mensaje recibido del cliente: ', data.toString());
        //esto envia un mensaje al cliente
        socket.write('Mensaje recibido\n');
        


        try {
            const response = await axios.post(EXPRESS_API_URL, {
                userName: 'Marito11',
                message: data.toString()
            });

            if (response.status === 201) {
                console.log(`✅ Mensaje de ${response.userName} enviado a Express (3000) y guardado en Firestore. Resp: ${response.data}`);
                socket.write('Mensaje recibido y guardado en DB\n');
            } else {
                // Axios arroja un error para respuestas 4xx o 5xx, pero es bueno manejarlo
                console.error(`❌ Express respondió con estado inesperado: ${response.status}`);
                socket.write('Error al guardar en DB\n');
            }
        } catch (error) {
            // Manejar errores de conexión (servidor Express caído) o errores de respuesta 4xx/5xx
            console.error('❌ Error al llamar al Servidor Express:', error.message);
            
            // Si el error tiene una respuesta (ej. 400/500), podemos loguear los datos
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
            }
            socket.write('Error de conexión con API\n');
        }

    });

    socket.on('close', ()=>{
        console.log('Conexion cerrada');
    });

    socket.on('error', (err)=>{
        console.error('Error: ', err);
    });
});

module.exports = { server };