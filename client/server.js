// load the things we need
const express = require('express');
const path = require('path');
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const app = express();

// --- LiveReload ---
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "view")); // 👈 vigila tu carpeta de vistas
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// --- Configuración de EJS ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view')); // usa ruta absoluta para evitar problemas

// --- Archivos estáticos ---
app.use(express.static('public'));

// --- Rutas ---
app.get('/chat', (req, res) => {
  res.render('pages/chat');
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
