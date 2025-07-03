window.addEventListener('DOMContentLoaded', () => {
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
});
