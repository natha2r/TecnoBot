import whatsappService from "./whatsappService.js";

class MessageHandler {
  constructor() {
    this.userState = {};
  }

  async handleIncomingMessage(message, senderInfo) {
    if (message?.type === "text") {
      const incomingMessage = message.text.body.toLowerCase().trim();
      const user = message.from;

      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(user, senderInfo);
        await this.sendMainMenu(user);
      } else {
        await this.handleMenuOption(user, incomingMessage);
      }
      await whatsappService.markAsRead(message.id);
    } else if (message?.type === "interactive") {
      // Nueva comprobación
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

  async sendWelcomeMessage(to, senderInfo) {
    const name = this.getSenderName(senderInfo);
    const welcomeMessage = ` 👋 ¡Hola ${name}! Soy el asistente virtual del Tecnoparque Nodo Bucaramanga Bienvenido. 🚀\n\n¿En qué puedo ayudarte?`;
    await whatsappService.sendMessage(to, welcomeMessage);
  }

  async sendMainMenu(to) {
    const menuMessage = `Para seleccionar una opción, simplemente escribe el número correspondiente:\n\n1️⃣ Información sobre Tecnoparque \n2️⃣ Registro y seguimiento de proyectos \n3️⃣ Asesorías y citas con expertos ‍\n4️⃣ Eventos y convocatorias \n5️⃣ Recursos y documentación \n6️⃣ Contacta un Asesor 🆘`;
    await whatsappService.sendMessage(to, menuMessage);
  }

  async handleButtonReply(to, buttonId) {
    switch (buttonId) {
      case "option_1":
        const latitude = 7.123456; // Reemplaza con la latitud real del Tecnoparque
        const longitude = -73.123456; // Reemplaza con la longitud real del Tecnoparque
        const name = "Tecnoparque Nodo Bucaramanga"; // Nombre del lugar
        const address = "📍 Cl. 48 #28-40, Sotomayor, Bucaramanga"; // Reemplaza con la dirección real

        await whatsappService.sendLocationMessage(
          to,
          latitude,
          longitude,
          name,
          address
        );

        // Mensaje adicional con horarios y diseño atractivo
        const horariosMessage = `🕘 *Horarios de Atención:*\nLunes a Viernes: 8:00 AM - 5:00 PM\n¡Te esperamos para impulsar juntos la innovación tecnológica! 🚀
      `;
        await whatsappService.sendMessage(to, horariosMessage);
        return;

      case "option_2":
        await whatsappService.sendMessage(
          to,
          "Tecnoparque ofrece especialización en: Software, Mecatrónica, Biotecnología, Automatización, y más."
        );
        return;

      case "option_3":
        await whatsappService.sendMessage(
          to,
          "*Cómo acceder a Tecnoparque Nodo Bucaramanga* \n\n✅ *Requisitos para acceder:*\n\n1️⃣ *Tener una idea de proyecto de base tecnológica.*\n- Tecnoparque está dirigido a emprendedores, estudiantes, investigadores y empresas que desean desarrollar soluciones innovadoras en áreas como desarrollo de software, automatización, biotecnología, diseño industrial y más.\n- No es necesario que tengas conocimientos avanzados, pero sí una idea clara del problema que deseas resolver y la motivación para desarrollarla.\n\n2️⃣ *Registrarte en la plataforma oficial de Tecnoparque.*\n- Ingresa a https://redtecnoparque.com/ y crea una cuenta.\n- Completa tu perfil con información sobre tu proyecto y el área de interés.\n- Una vez registrado, selecciona el Nodo *Bucaramanga* y describe brevemente tu idea.\n\n3️⃣ *Asistir a una charla informativa y agendar una reunión con nuestros expertos.*\n- Luego de registrarte, recibirás una invitación para participar en una sesión informativa donde te explicaremos cómo funciona Tecnoparque y los beneficios que te ofrecemos.\n- Posteriormente, podrás agendar una reunión personalizada con un experto en tu área de interés, quien te orientará en el desarrollo de tu proyecto.\n\n");
        return;

      case "option_4":
        await whatsappService.sendMessage(
          to,
          "Para registrar un nuevo proyecto en Tecnoparque Nodo Bucaramanga, sigue estos pasos:\n\n1️⃣ Regístrate en la plataforma de Tecnoparque: (https://redtecnoparque.com/).\n2️⃣ Inicia sesión y crea una nueva idea de proyecto.\n3️⃣ Elige el nodo 'Bucaramanga' y describe tu idea.\n\n Tutorial: https://www.youtube.com/watch?v=jY7SiSPnlKc."
        );
        return;

      case "option_5":
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

  async handleMenuOption(to, option) {
    switch (option) {
      case "1":
        await whatsappService.sendInteractiveButtons(
          to,
          "Selecciona la información que necesitas:",
          [
            { type: "reply", reply: { id: "option_1", title: "Ubicación" } },
            { type: "reply", reply: { id: "option_2", title: "Nuestras Líneas" } },
            { type: "reply", reply: { id: "option_3", title: "Accede a Tecnoparque" } },
          ]
        );
        return;

      case "2":
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

      case "6":
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

      case "4":
  await whatsappService.sendInteractiveButtons(
    to,
    " *Eventos y Convocatorias en Tecnoparque Bucaramanga*\n\nMantente informado sobre los próximos eventos, talleres y convocatorias disponibles en Tecnoparque Nodo Bucaramanga.\n\n *Eventos disponibles:*\n- *Bootcamp de Innovación Tecnológica* - Fecha:  [Fecha del evento]\n- *Workshop de Inteligencia Artificial* - Fecha:  [Fecha del evento]\n\n *Convocatorias abiertas:*\n- *Convocatoria de Emprendimientos Tecnológicos* - Cierre:  [Fecha de cierre]\n- *Acceso a laboratorios y prototipado* - Cierre:  [Fecha de cierre]\n\n Más información y registro aquí: [Página oficial de eventos](https://redtecnoparque.com/eventos)");
  return;
      // ... (Agrega más casos para otros números del menú principal)

      default:
        await whatsappService.sendMessage(
          to,
          "Lo siento, no entendí tu selección. Por favor, elige una opción válida."
        );
    }
  }
}

export default new MessageHandler();
