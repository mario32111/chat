// load the things we need
const express = require('express');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const axios = require('axios');
const app = express();

if (process.env.NODE_ENV === 'development') {
  // --- LiveReload ---
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "view")); // 👈 vigila tu carpeta de vistas
  app.use(connectLivereload());

  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
}

// --- Configuración de EJS ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view')); // usa ruta absoluta para evitar problemas

// --- Archivos estáticos ---
app.use(express.static('public'));



//sockets
const { on } = require('events');
const net = require('net');
//esta libreria permite leer desde la consola



const server = {
  port: 3001,
  host: 'localhost'
}

//crea una conexion al servidor, un nuevo socket, es el evento 'connection' del servidor
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

// --- Rutas ---
app.use(express.json());

app.get('/chat', (req, res) => {


  res.render('pages/chat');
});

app.post('/newMessage', (req, res) => {
  console.log(req.body);
  const message = req.body.message;
  if (cliente && message) {
    cliente.write(message + '\n');

    return res.status(201).json({ status: 'success', message: 'Mensaje enviado a servidor NET' });
  } else {
    // Manejar error de conexión o mensaje vacío
    return res.status(503).json({ status: 'error', message: 'Servicio no disponible o mensaje vacío.' });
  }
});



app.get('/user', (req, res) => {
  res.render('pages/userInput');
});

app.get('/', (req, res) => {
  res.render('pages/userInput');
});


// --- Servidor ---
const PORT = 8080;
app.listen(PORT, () => console.log(`${PORT} is the magic port 🚀`));
