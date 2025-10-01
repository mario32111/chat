
//sockets
const { on } = require('events');
const net = require('net');
const server = {
  port: 3001,
  host: 'localhost'
}

const cliente = net.createConnection(server);

cliente.on('connect', () => {
  console.log('Cliente conectado al servidor!');
  cliente.write('Hola servidor! \n');
})

cliente.on('error', (err) => {
  console.error('El cliente NET falló. Reintentando...', err);

});

cliente.on('close', () => {
  console.warn('El servidor NET cerró la conexión.');

});

module.exports = cliente;