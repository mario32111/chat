// Variables globales para la conexión y la identidad del usuario
let socket;
let userName = ''; // Se llenará dinámicamente en handleLogin()

// Elementos del DOM (Se asume que este script se carga al final del body, por lo que el DOM ya está disponible)
const loginView = document.getElementById('login-view');
const chatView = document.getElementById('chat-view');
const usernameInput = document.getElementById('usernameInput');
const errorMessage = document.getElementById('error-message');
const currentUserDisplay = document.getElementById('current-user-display');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

/**
 * Maneja el evento de inicio de sesión: valida el nombre, cambia la vista y conecta el socket.
 * Esta función es llamada directamente por el botón 'Entrar al Chat' en index.html.
 */
function handleLogin() {
    const inputName = usernameInput.value.trim();

    if (!inputName) {
        errorMessage.classList.remove('hidden');
        return;
    }

    // 1. Asignar el nombre de usuario dinámico
    userName = inputName;
    errorMessage.classList.add('hidden');

    // 2. Cambiar la vista de Login a Chat
    loginView.classList.add('hidden');
    chatView.classList.remove('hidden');

    // 3. Actualizar la visualización del usuario actual
    currentUserDisplay.textContent = `Conectado como: ${userName}`;

    // 4. Inicializar la conexión del socket y la carga de mensajes
    viewInit();
}

/**
 * Intenta cargar mensajes históricos. Requiere una ruta /messages en el servidor Express.
 */
async function loadMessages() {
    try {
        // NOTA: Esta URL de localhost DEBE ser cambiada para apuntar a tu servidor Express/backend real.
        const response = await fetch('http://localhost:3000/messages');
        if (!response.ok) {
            throw new Error('No se pudieron cargar los mensajes históricos');
        }
        const messages = await response.json();

        messagesContainer.innerHTML = '';
        messages.forEach(msg => {
            // Si un mensaje es del usuario actual, lo marcamos como 'sent'
            const type = msg.userName === userName ? 'sent' : 'received';
            renderMessage({ ...msg, type: type });
        });
        console.log(`Mensajes históricos cargados: ${messages.length}`);

    } catch (error) {
        console.error('Error al cargar mensajes:', error);
        renderMessage({
            userName: 'Sistema',
            message: 'Advertencia: No se pudo conectar a /messages. Revisa la ruta y el puerto en el servidor.',
            type: 'system'
        });
    }
}

/**
 * Establece la conexión con Socket.IO y define los listeners.
 */
function connectToSocket() {
    // NOTA: Esta URL de localhost DEBE ser cambiada para apuntar a tu servidor Socket.IO real.
    socket = io('http://localhost:3001');

    socket.on('chat message', function (msg) {
        console.log('Mensaje recibido del servidor:', msg);
        // Determinar si el mensaje recibido fue enviado por este mismo cliente
        const type = msg.userName === userName ? 'sent' : 'received';
        renderMessage({ userName: msg.userName || 'Usuario Desconocido', message: msg.message, type: type });
    });

    socket.on('error message', function (errorMsg) {
        console.error('Mensaje de error del servidor:', errorMsg);
        renderMessage({ userName: 'Sistema', message: errorMsg, type: 'system' });
    });
}

/**
 * Renderiza un único mensaje en el contenedor, aplicando estilos de 'enviado' o 'recibido'.
 */
function renderMessage(data) {
    console.log('Renderizando mensaje:', data);
    
    // Compara el nombre del mensaje con el nombre dinámico del usuario actual
    const isSelf = data.type === 'sent' || data.userName === userName;
    const isSystem = data.type === 'system';

    const messageDiv = document.createElement('div');
    // Estilos para alinear a la derecha (enviado) o izquierda (recibido/sistema)
    messageDiv.className = `flex ${isSelf ? 'justify-end' : 'justify-start'}`;

    const contentDiv = document.createElement('div');
    let baseClasses = 'max-w-[75%] px-4 py-2 rounded-xl shadow-md text-sm';
    
    if (isSelf) {
        contentDiv.className = `${baseClasses} bg-blue-500 text-white rounded-br-none`;
    } else if (isSystem) {
        contentDiv.className = `${baseClasses} bg-yellow-100 text-yellow-800 text-center`;
        messageDiv.className = 'flex justify-center'; // Centrar mensajes del sistema
    } else {
        contentDiv.className = `${baseClasses} bg-gray-200 text-gray-800 rounded-tl-none`;
    }

    // El contenido del mensaje
    contentDiv.innerHTML = `
        ${!isSelf && !isSystem ? `<strong class="text-xs font-semibold block mb-1 text-blue-700">${data.userName || 'Usuario'}</strong>` : ''}
        <p>${data.message}</p>
    `;

    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);

    // Hacer scroll al último mensaje
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Función para enviar el mensaje por Socket.IO.
 * Esta función es llamada directamente por el formulario 'onsubmit' en index.html.
 */
async function sendMessage(event) {
    event.preventDefault();

    const message = messageInput.value.trim();

    if (message === '' || !userName) return;

    if (!socket) {
        console.error("Socket no conectado. Por favor, asegúrate de estar logueado y de que el servidor esté activo.");
        return;
    }

    // 1. Enviar el mensaje al servidor, usando el nombre dinámico
    socket.emit('chat message', { userName: userName, message: message });

    // 2. Limpiar el input
    messageInput.value = '';
}

/**
 * Inicializa la conexión una vez que el usuario se ha logueado.
 */
function viewInit() {
    connectToSocket();
     loadMessages();
}
