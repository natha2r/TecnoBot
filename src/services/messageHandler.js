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
    const welcomeMessage = `👋 ¡Hola ${name}! Bienvenido a Tecnoparque Nodo Bucaramanga 🚀\n\n¿En qué puedo ayudarte?`;
    await whatsappService.sendMessage(to, welcomeMessage);
  }

  async sendMainMenu(to) {
    const menuMessage = `Para seleccionar una opción, simplemente escribe el número correspondiente:\n\n1️⃣ Información sobre Tecnoparque 📌\n2️⃣ Registro y seguimiento de proyectos 📑\n3️⃣ Asesorías y citas con expertos 👨‍🏫\n4️⃣ Eventos y convocatorias 📅\n5️⃣ Recursos y documentación 📚\n6️⃣ Contactar a un mentor 🆘`;
    await whatsappService.sendMessage(to, menuMessage);
  }

  async handleMenuOption(to, option) {
    let response;
    switch (option) {
      case "1":
        response = `💬 Selecciona la información que necesitas:\n\n1️⃣ Ubicación y horarios de atención 🏢\n2️⃣ Áreas de especialización 🔍\n3️⃣ Requisitos para acceder a los servicios 🛠`;
        break;
      case "2":
        response = `💬 ¿Qué deseas hacer?\n\n1️⃣ Registrar un nuevo proyecto 📝\n2️⃣ Consultar el estado de mi proyecto 🔄`;
        break;
      case "3":
        response = `💬 ¿En qué área necesitas asesoría?\n\n1️⃣ Inteligencia Artificial y Software 🤖\n2️⃣ Automatización y Mecatrónica ⚙️\n3️⃣ Diseño e Impresión 3D 🏗\n4️⃣ Biotecnología y Materiales 🔬`;
        break;
      case "4":
        response = `💬 ¿Qué tipo de eventos te interesan?\n\n1️⃣ Cursos y talleres 🎓\n2️⃣ Hackathones y retos de innovación 💡\n3️⃣ Convocatorias para proyectos 📢`;
        break;
      case "5":
        response = `💬 ¿Qué tipo de material necesitas?\n\n1️⃣ Guías y manuales técnicos 📖\n2️⃣ Formatos para proyectos 📝\n3️⃣ Casos de éxito y ejemplos 📂`;
        break;
      case "6":
        response = `💬 ¿Prefieres hablar con un mentor por...?\n\n1️⃣ Chat en vivo (si hay disponibilidad) 💬\n2️⃣ Correo electrónico 📧\n3️⃣ Llamada telefónica 📞`;
        break;
      default:
        response = "Lo siento, no entendí tu selección. Por favor, elige una opción válida escribiendo el número correspondiente.";
    }
    await whatsappService.sendMessage(to, response);
  }
}

export default new MessageHandler();
