const router = require('express').Router();
const cliente = require('../config');


router.get('/chat', (req, res) => {
  res.render('pages/chat');
});

router.post('/newMessage', (req, res) => {
  console.log(req.body);
  const message = req.body.message;
  if (cliente && message) {
    cliente.emit('chat message', message);
    return res.status(201).json({ status: 'success', message: 'Mensaje enviado a servidor NET' });
  } else {
    // Manejar error de conexión o mensaje vacío
    return res.status(503).json({ status: 'error', message: 'Servicio no disponible o mensaje vacío.' });
  }
});



router.get('/user', (req, res) => {
  res.render('pages/userInput');
});

router.get('/', (req, res) => {
  res.render('pages/userInput');
});

module.exports = router;
