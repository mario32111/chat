// db.js
const admin = require("firebase-admin");
const serviceAccount = require("../firebase-key.json");

// Inicializar Firebase si no ha sido inicializado
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

module.exports = { db };