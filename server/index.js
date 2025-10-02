const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const app = express();
const path = require("path");  // <-- IMPORTANTE

app.use(cors());
app.use(express.json());

const serviceAccount = require("./firebase-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

app.use("/", require("./routes/index"));
app.use(express.static(path.join(__dirname, "public")));


// Configurar EJS como motor de plantillas
app.set("view engine", "ejs");
// Ubicación de las vistas
app.set("views", path.join(__dirname, "views"));

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
);

require('./config/socket');
