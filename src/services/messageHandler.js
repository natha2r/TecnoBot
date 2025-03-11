import whatsappService from "./whatsappService.js";
import * as messages from "./messages.js";

class MessageHandler {
  constructor() {
    this.userState = {};
  }

  async sendWelcomeMessage(to, senderInfo) {
    const name = this.getSenderName(senderInfo);
    await whatsappService.sendMessage(to, messages.WELCOME_MESSAGE(name));
  }

  async sendMainMenu(to) {
    await whatsappService.sendMessage(to, messages.MAIN_MENU_MESSAGE);
  }

  async handleIncomingMessage(message, senderInfo) {
    if (message?.type === "text") {
      const incomingMessage = message.text.body.toLowerCase().trim();
      const user = message.from;
      const to = message.from;

      if (this.userState[user]?.action === "lineas_tecnologicas") {
        const seleccion = message.text.body.trim();
        switch (seleccion) {
          case "1":
            await whatsappService.sendMessage(to, messages.ING_DISENO_MESSAGE);
            break;
          case "2":
            await whatsappService.sendMessage(to, messages.BIOTECNOLOGIA_MESSAGE);
            break;
          case "3":
            await whatsappService.sendMessage(to, messages.ELECTRONICA_MESSAGE);
            break;
          case "4":
            await whatsappService.sendMessage(to, messages.TECNOLOGIAS_MESSAGE);
            break;
          default:
            await whatsappService.sendMessage(to, messages.OPCION_INVALIDA_MESSAGE);
        }
        delete this.userState[user];
        return;
      }

      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(user, senderInfo);
        await this.sendMainMenu(user);
      } else {
        await this.handleMenuOption(user, incomingMessage);
      }
      await whatsappService.markAsRead(message.id);
    } else if (message?.type === "interactive") {
      const user = message.from;
      const buttonId = message.interactive.button_reply.id;
      await this.handleButtonReply(user, buttonId);
      await whatsappService.markAsRead(message.id);
    }
  }

  isGreeting(message) {
    const greetings = ["hola", "hello", "hi", "buenas tardes"];
    return greetings.includes(message);
  }

  getSenderName(senderInfo) {
    return senderInfo.profile?.name || senderInfo.wa_id;
  }

  async handleButtonReply(to, buttonId) {
    switch (buttonId) {
      case "option_1": //Ubicación
        const latitude = 7.123456;
        const longitude = -73.123456;
        const name = "Tecnoparque Nodo Bucaramanga";
        const address = "📍 Cl. 48 #28-40, Sotomayor, Bucaramanga";

        await whatsappService.sendLocationMessage(
          to,
          latitude,
          longitude,
          name,
          address
        );

        await whatsappService.sendMessage(to, messages.HORARIOS_MESSAGE);
        return;

      case "option_2": // Líneas Tecnológicas
        await whatsappService.sendMessage(to, messages.LINEAS_TECNOLOGICAS_MESSAGE);
        return;

      case "option_3": // Accede a Tecnoparque
        await whatsappService.sendMessage(
          to,
          "*Cómo acceder a Tecnoparque Nodo Bucaramanga* \n\n✅ *Requisitos para acceder:*\n\n1️⃣ *Tener una idea de proyecto de base tecnológica.*\n- Tecnoparque está dirigido a emprendedores, estudiantes, investigadores y empresas que desean desarrollar soluciones innovadoras en áreas como desarrollo de software, automatización, biotecnología, diseño industrial y más.\n- No es necesario que tengas conocimientos avanzados, pero sí una idea clara del problema que deseas resolver y la motivación para desarrollarla.\n\n2️⃣ *Registrarte en la plataforma oficial de Tecnoparque.*\n- Ingresa a https://redtecnoparque.com/ y crea una cuenta.\n- Completa tu perfil con información sobre tu proyecto y el área de interés.\n- Una vez registrado, selecciona el Nodo *Bucaramanga* y describe brevemente tu idea.\n\n3️⃣ *Asistir a una charla informativa y agendar una reunión con nuestros expertos.*\n- Luego de registrarte, recibirás una invitación para participar en una sesión informativa donde te explicaremos cómo funciona Tecnoparque y los beneficios que te ofrecemos.\n- Posteriormente, podrás agendar una reunión personalizada con un experto en tu área de interés, quien te orientará en el desarrollo de tu proyecto.\n\n"
        );
        return;

      case "option_4": // Registrar un Proyecto
        await whatsappService.sendMessage(
          to,
          "Para registrar un nuevo proyecto en Tecnoparque Nodo Bucaramanga, sigue estos pasos:\n\n1️⃣ Regístrate en la plataforma de Tecnoparque: (https://redtecnoparque.com/).\n2️⃣ Inicia sesión y crea una nueva idea de proyecto.\n3️⃣ Elige el nodo 'Bucaramanga' y describe tu idea.\n\n Tutorial: https://www.youtube.com/watch?v=jY7SiSPnlKc."
        );
        return;

      case "option_5": //Consultar estado de un proyecto
        await whatsappService.sendMessage(
          to,
          "Para consultar el estado de tu proyecto en Tecnoparque Nodo Bucaramanga:\n\n🔍 Ingresa a la plataforma de Tecnoparque: [redtecnoparque.com](https://redtecnoparque.com/).\n🔑 Inicia sesión con tu usuario registrado.\n📋 Dirígete a la sección 'Mis Proyectos' para ver el estado actual.\n\n📌 Si tienes dudas, comunícate con el equipo de Tecnoparque Bucaramanga."
        );
        return;

      case "option_6":
        await whatsappService.sendMessage(
          to,
          "🔗 Puedes registrarte en los eventos y convocatorias a través de nuestro formulario oficial: https://redtecnoparque.com/eventos"
        );
        return;

      case "option_7":
        await whatsappService.sendMessage(
          to,
          "📅 Para agendar una reunión con un asesor de Tecnoparque, accede a: https://redtecnoparque.com/citas"
        );
        return;

      case "option_8":
        await whatsappService.sendMessage(
          to,
          "❓ *Preguntas Frecuentes sobre Eventos y Convocatorias en Tecnoparque*\n\n1️⃣ *¿Quiénes pueden participar en los eventos?*\n   - Cualquier persona interesada en la tecnología y la innovación.\n\n2️⃣ *¿Los eventos tienen costo?*\n   - No, todos los eventos son gratuitos.\n\n3️⃣ *¿Cómo me inscribo en un evento?*\n   - Puedes registrarte en: https://redtecnoparque.com/eventos"
        );
        return;

      // ... (Agrega más casos para otros botones)

      default:
        await whatsappService.sendMessage(
          to,
          "Lo siento, no entendí tu selección. Por favor, elige una opción válida."
        );
    }
  }

  async handleMenuOption(to, option) { //Manejo de Opciones menú principal
    switch (option) {
      case "1": //Información sobre Tecnoparque
        await whatsappService.sendInteractiveButtons(
          to,
          "Selecciona la información que necesitas:",
          [
            { type: "reply", reply: { id: "option_1", title: "Ubicación" } },
            {
              type: "reply",
              reply: { id: "option_2", title: "Líneas Tecnológicas" },
            },
            {
              type: "reply",
              reply: { id: "option_3", title: "Accede a Tecnoparque" },
            },
          ]
        );
        return;

      case "2": // Registro y Seguimeinto de Proyectos
        await whatsappService.sendInteractiveButtons(
          to,
          "Selecciona la información que necesitas:",
          [
            {
              type: "reply",
              reply: { id: "option_4", title: "Registrar Proyecto" },
            },
            {
              type: "reply",
              reply: { id: "option_5", title: "Consultar Proyecto" },
            },
          ]
        );
        return;

      case "4": // Eventos y convocatorias
        await whatsappService.sendMessage(
          to,
          " *Eventos y Convocatorias en Tecnoparque Bucaramanga*\n\nMantente informado sobre los próximos eventos, talleres y convocatorias disponibles en Tecnoparque Nodo Bucaramanga.\n\n *Eventos disponibles:*\n- *Bootcamp de Innovación Tecnológica* - Fecha:  [Fecha del evento]\n- *Workshop de Inteligencia Artificial* - Fecha:  [Fecha del evento]\n\n *Convocatorias abiertas:*\n- *Convocatoria de Emprendimientos Tecnológicos* - Cierre:  [Fecha de cierre]\n- *Acceso a laboratorios y prototipado* - Cierre:  [Fecha de cierre]\n\n Más información y registro aquí: [Página oficial de eventos](https://redtecnoparque.com/eventos)"
        );
        return;

        case "6": //Contacta a un Asesor
        const mentorContact = {
          name: {
            formatted_name: "Ing. Tecnoparque",
            first_name: "Rafael",
            last_name: "Ramírez",
          },
          phones: [
            {
              phone: "+573175491833",
              type: "WORK",
            },
          ],
        };
        await whatsappService.sendContactMessage(to, mentorContact);
        return;
      // ... (Agrega más casos para otros números del menú principal)

      default:
        await whatsappService.sendMessage(to.OPCION_INVALIDA_MESSAGE);
    }
  }
}

export default new MessageHandler();
