const router = require("express").Router();
const { db } = require("../config/db");
const admin = require("firebase-admin");

router.post("/saveMessage", (req, res) => {
  const { userName, message } = req.body;
  db.collection("messages")
    .add({ userName, message, timestamp: admin.firestore.FieldValue.serverTimestamp() })
    .then(() => {
      res.status(201).send("Mensaje guardado en Firestore");
    })
    .catch((error) => {
      console.error("Error al guardar mensaje: ", error);
      res.status(500).send("Error al guardar mensaje");
    });
});

router.get("/messages", (req, res) => {
  db.collection("messages") 
    .orderBy("timestamp", "asc")
    .get()
    .then((snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
            messages.push(doc.data());
        });
        res.status(200).json(messages);
    })
    .catch((error) => {
        console.error("Error al obtener mensajes: ", error);
        res.status(500).send("Error al obtener mensajes");
    });

});

module.exports = router;