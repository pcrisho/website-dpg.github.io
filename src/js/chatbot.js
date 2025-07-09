/*window.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('chatbot-toggle');
  const box = document.getElementById('chatbot-box');
  const input = document.getElementById('chat-input');
  const button = document.getElementById('chat-button');
  const log = document.getElementById('chat-log');

  let redireccionPendiente = null;

  input.disabled = true;
  input.placeholder = "Usa las opciones debajo";

  toggle.addEventListener('click', () => {
    box.classList.toggle('hidden');
    if (!box.classList.contains('hidden')) {
      log.innerHTML = '';
      iniciarChatbot();
    }
  });

  button.textContent = "🔄 Reiniciar";
  button.addEventListener('click', () => {
    log.innerHTML = '';
    iniciarChatbot();
  });

  function iniciarChatbot() {
    redireccionPendiente = null;
    mostrarMensaje('Bot', '¡Hola! ¿En qué puedo ayudarte?');
    mostrarOpciones(['Conócenos', 'Calculadora', 'Recursos', 'Contacto', 'Salir']);
  }

  function mostrarMensaje(remitente, texto) {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${remitente}:</strong> ${texto}`;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function mostrarOpciones(opciones) {
    const opcionesDiv = document.createElement('div');
    opcionesDiv.classList.add('opciones');

    opciones.forEach(opcion => {
      const btn = document.createElement('button');
      btn.textContent = opcion;
      btn.classList.add('chat-opcion');
      btn.addEventListener('click', () => {
        mostrarMensaje('Tú', opcion);
        if (opcion === 'Sí' || opcion === 'No') {
          manejarConfirmacion(opcion);
        } else {
          procesarOpcion(opcion);
        }
        opcionesDiv.remove();
      });
      opcionesDiv.appendChild(btn);
    });

    log.appendChild(opcionesDiv);
    log.scrollTop = log.scrollHeight;
  }

  function procesarOpcion(opcion) {
    let respuesta = '';

    switch (opcion.toLowerCase()) {
      case 'conócenos':
        respuesta = 'Somos una plataforma dedicada a ayudarte. ¿Te gustaría redirigirte a la página de Conócenos?';
        redireccionPendiente = '../../../../public/pages/about/about-us.html';
        break;
      case 'calculadora':
        respuesta = 'Nuestra calculadora de notas te permite estimar tus promedios. ¿Deseas ir al módulo de calculadora?';
        redireccionPendiente = '../../../../public/pages/grade-calculator/calculator.html';
        break;
      case 'recursos':
        respuesta = 'Aquí puedes encontrar guías, tutoriales y más. ¿Quieres visitar la página de Recursos?';
        redireccionPendiente = '../../../../public/pages/resources/resources.html';
        break;
      case 'contacto':
        respuesta = 'Puedes escribirnos a conectacto@empresa.com.';
        redireccionPendiente = null;
        break;
      case 'salir':
        respuesta = '¡Hasta luego!';
        redireccionPendiente = null;
        setTimeout(() => {
          box.classList.add('hidden');
        }, 1000);
        break;
      default:
        respuesta = 'No entendí esa opción.';
        redireccionPendiente = null;
    }

    setTimeout(() => {
      mostrarMensaje('Bot', respuesta);

      if (redireccionPendiente) {
        mostrarOpciones(['Sí', 'No']);
      }
    }, 500);
  }

  function manejarConfirmacion(respuesta) {
    if (respuesta === 'Sí' && redireccionPendiente) {
      mostrarMensaje('Bot', 'Redirigiendo...');
      setTimeout(() => {
        window.location.href = redireccionPendiente;
      }, 1000);
    } else {
      mostrarMensaje('Bot', 'De acuerdo. ¿En qué más te puedo ayudar?');
      redireccionPendiente = null;
      setTimeout(() => {
        mostrarOpciones(['Conócenos', 'Calculadora', 'Recursos', 'Contacto', 'Salir']);
      }, 500);
    }
  }
});*/



const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const CloseChatbot = document.querySelector("#close-chatbot");

// API Setup
const API_KEY = "AIzaSyA2SFiB3VsmdNHED3ceELSZe7H9nBuZ2hk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null
  }
};

const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

const scrollToLatestMessage = () => {
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
};

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const botAvatarSVG = `
  <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
  </svg>`;

const addInitialBotMessage = () => {
  const initialBotHTML = `
    ${botAvatarSVG}
    <div class="message-text">¡Hola! ¿En qué puedo ayudarte hoy?</div>`;
  const initialBotDiv = createMessageElement(initialBotHTML, "bot-message");
  chatBody.appendChild(initialBotDiv);
  scrollToLatestMessage();
  chatHistory.push({
    role: "model",
    parts: [{ text: "¡Hola! ¿En qué puedo ayudarte hoy?" }]
  });
};

// NUEVO: Respuestas predefinidas
const getPredefinedResponse = (userMessage) => {
  const msg = userMessage.toLowerCase();

  if (msg.includes("nota") || msg.includes("promedio") || msg.includes("calculadora")) {
    return "Claro, aquí tienes una calculadora de notas: <a href='../../../public/pages/grade-calculator/calculator.html'>Calculadora de notas</a>";
  }

  if (msg.includes("conectando") || msg.includes("plataforma") || msg.includes("qué es esto")) {
    return "Conectando es la plataforma educativa para compartir recursos, resolver dudas y potenciar tu aprendizaje.";
  }

  if (msg.includes("recursos") || msg.includes("certificados") || msg.includes("cursos")) {
    return "Puedes acceder a recursos gratuitos aquí: <a href='../../../public/pages/resources/resources.html' >Recursos gratuitos</a>";
  }

  return null;
};

const generateBotResponse = async (incomingMessageDiv) => {
  // Agregar mensaje del usuario al historial
  chatHistory.push({
    role: "user",
    parts: [
      { text: userData.message },
      ...(userData.file.data ? [{ inline_data: userData.file }] : [])
    ]
  });

  // Buscar respuesta predefinida
  const predefined = getPredefinedResponse(userData.message);
  if (predefined) {
    incomingMessageDiv.classList.remove("thinking");
    incomingMessageDiv.innerHTML = `
      ${botAvatarSVG}
      <div class="message-text">${predefined}</div>
    `;
    chatHistory.push({ role: "model", parts: [{ text: predefined }] });
    scrollToLatestMessage();
    userData.file = {};
    return;
  }

  // Si no hay respuesta predefinida, llamar a la API
  try {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: chatHistory })
    };

    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error.message);

    const apiResponseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();

    incomingMessageDiv.classList.remove("thinking");
    incomingMessageDiv.innerHTML = `
      ${botAvatarSVG}
      <div class="message-text">${apiResponseText}</div>
    `;

    chatHistory.push({ role: "model", parts: [{ text: apiResponseText }] });

  } catch (error) {
    console.error(error);
    incomingMessageDiv.classList.remove("thinking");
    incomingMessageDiv.innerHTML = `
      ${botAvatarSVG}
      <div class="message-text" style="color: #ff0000;">${error.message}</div>
    `;
  } finally {
    userData.file = {};
    scrollToLatestMessage();
  }
};

const handleOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  if (!userData.message) return;

  messageInput.value = "";
  fileUploadWrapper.classList.remove("file-uploaded");
  messageInput.dispatchEvent(new Event("input"));

  const messageContent = `
    <div class="message-text"></div>
    ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;

  const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
  outgoingMessageDiv.querySelector(".message-text").textContent = userData.message;
  chatBody.appendChild(outgoingMessageDiv);
  scrollToLatestMessage();

  setTimeout(() => {
    const botThinkingContent = `
      ${botAvatarSVG}
      <div class="message-text">
        <div class="thinking-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>`;

    const incomingMessageDiv = createMessageElement(botThinkingContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessageDiv);
    scrollToLatestMessage();
    generateBotResponse(incomingMessageDiv);
  }, 600);
};

messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768) {
    handleOutgoingMessage(e);
  }
});

messageInput.addEventListener("input", () => {
  messageInput.style.height = `${initialInputHeight}px`;
  messageInput.style.height = `${messageInput.scrollHeight}px`;
  document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    const base64String = e.target.result.split(",")[1];
    userData.file = {
      data: base64String,
      mime_type: file.type
    };
    fileInput.value = "";
  };
  reader.readAsDataURL(file);
});

fileCancelButton.addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-uploaded");
});

const picker = new EmojiMart.Picker({
  theme: "light",
  skinTonePosition: "none",
  previewPosition: "none",
  onEmojiSelect: (emoji) => {
    const { selectionStart: start, selectionEnd: end } = messageInput;
    messageInput.setRangeText(emoji.native, start, end, "end");
    messageInput.focus();
  },
  onClickOutside: (e) => {
    if (e.target.id === "emoji-picker") {
      document.body.classList.toggle("show-emoji-picker");
    } else {
      document.body.classList.remove("show-emoji-picker");
    }
  }
});
document.querySelector(".chat-form").appendChild(picker);

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());

chatbotToggler.addEventListener("click", () => {
  const wasOpen = document.body.classList.contains("show-chatbot");
  document.body.classList.toggle("show-chatbot");
  if (!wasOpen) {
    chatBody.innerHTML = "";
    chatHistory.length = 0;
    messageInput.value = "";
    messageInput.style.height = `${initialInputHeight}px`;
    fileUploadWrapper.classList.remove("file-uploaded");
    userData.message = null;
    userData.file = { data: null, mime_type: null };
    addInitialBotMessage();
  }
});

CloseChatbot.addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
});
