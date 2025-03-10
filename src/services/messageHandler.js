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
    } else if (message?.type === "interactive") { // Nueva comprobación
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
    const menuMessage = `Para seleccionar una opción, simplemente escribe el número correspondiente:\n\n1️⃣ Información sobre Tecnoparque \n2️⃣ Registro y seguimiento de proyectos \n3️⃣ Asesorías y citas con expertos ‍\n4️⃣ Eventos y convocatorias \n5️⃣ Recursos y documentación \n6️⃣ Contactar a un mentor 🆘`;
    await whatsappService.sendMessage(to, menuMessage);
  }

  async handleButtonReply(to, buttonId) {
    switch (buttonId) {
      case "option_1":
        await whatsappService.sendMessage(to, "Tecnoparque Nodo Bucaramanga está ubicado en [Dirección]. Horario: Lunes a Viernes de 8 AM a 5 PM.");
        return;
  
      case "option_2":
        await whatsappService.sendMessage(to, "Tecnoparque ofrece especialización en: Software, Mecatrónica, Biotecnología, Automatización, y más.");
        return;
  
      case "option_3":
        await whatsappService.sendMessage(to, "✅ Para acceder a los servicios de Tecnoparque necesitas presentar un proyecto o idea innovadora.");
        return;

        case "option_4":
          await whatsappService.sendMessage(to, "Para registrar un nuevo proyecto en Tecnoparque Nodo Bucaramanga, sigue estos pasos:\n\n1️⃣ Regístrate en la plataforma de Tecnoparque: (https://redtecnoparque.com/).\n2️⃣ Inicia sesión y crea una nueva idea de proyecto.\n3️⃣ Elige el nodo 'Bucaramanga' y describe tu idea.\n\n Tutorial: https://www.youtube.com/watch?v=jY7SiSPnlKc.");
        return;
  
      case "option_5":
        await whatsappService.sendMessage(to, "Para consultar el estado de tu proyecto en Tecnoparque Nodo Bucaramanga:\n\n🔍 Ingresa a la plataforma de Tecnoparque: [redtecnoparque.com](https://redtecnoparque.com/).\n🔑 Inicia sesión con tu usuario registrado.\n📋 Dirígete a la sección 'Mis Proyectos' para ver el estado actual.\n\n📌 Si tienes dudas, comunícate con el equipo de Tecnoparque Bucaramanga.");
        return;
  
      // ... (Agrega más casos para otros botones)
  
      default:
        await whatsappService.sendMessage(to, "Lo siento, no entendí tu selección. Por favor, elige una opción válida.");
    }
  }

  async handleMenuOption(to, option) {
    switch (option) {
      case "1":
        await whatsappService.sendInteractiveButtons(to, "Selecciona la información que necesitas:", [
          { type: "reply", reply: { id: "option_1", title: "Ubicación" } },
          { type: "reply", reply: { id: "option_2", title: "Áreas" } },
          { type: "reply", reply: { id: "option_3", title: "Requisitos" } }
        ]);
        return;

        case "2":
        await whatsappService.sendInteractiveButtons(to, "Selecciona la información que necesitas:", [
          { type: "reply", reply: { id: "option_4", title: "Registrar Proyecto" } },
          { type: "reply", reply: { id: "option_5", title: "Consultar Proyecto" } }
        ]);
        return;
  
      // ... (Agrega más casos para otros números del menú principal)
  
      default:
        await whatsappService.sendMessage(to, "Lo siento, no entendí tu selección. Por favor, elige una opción válida.");
    }
  }
}

export default new MessageHandler();