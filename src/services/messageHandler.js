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
    console.log("Mensaje recibido:", message);
    console.log("Estado del usuario:", this.userState);
    if (message?.type === "text") {
      const incomingMessage = message.text.body.toLowerCase().trim();
      const user = message.from;
      const to = message.from;

      console.log("Verificando estado de lineas_tecnologicas");
      if (this.userState[user]?.action === "lineas_tecnologicas") {
        console.log("Usuario en estado de lineas_tecnologicas");
        const seleccion = message.text.body.trim();
        switch (seleccion) {
          case "1":
            await whatsappService.sendMessage(to, messages.ING_DISENO_MESSAGE);
            await whatsappService.sendInteractiveButtons(
              to,
              "¿Necesitas ayuda adicional?",
              [
                { type: "reply", reply: { id: "terminar", title: "No, gracias" } },
                {
                  type: "reply",
                  reply: { id: "lineas", title: "Ver otra línea" },
                },
                {
                  type: "reply",
                  reply: { id: "menu", title: "Menú principal" },
                },
              ]
            );
            break;
          case "2":
            await whatsappService.sendMessage(to,messages.BIOTECNOLOGIA_MESSAGE);
            await whatsappService.sendInteractiveButtons(
              to,
              "¿Necesitas ayuda adicional?",
              [
                { type: "reply", reply: { id: "terminar", title: "No, gracias" } },
                {
                  type: "reply",
                  reply: { id: "lineas", title: "Ver otra línea" },
                },
                {
                  type: "reply",
                  reply: { id: "menu", title: "Menú principal" },
                },
              ]
            );
            break;
          case "3":
            await whatsappService.sendMessage(to, messages.ELECTRONICA_MESSAGE);
            await whatsappService.sendInteractiveButtons(
              to,
              "¿Necesitas ayuda adicional?",
              [
                { type: "reply", reply: { id: "terminar", title: "No, gracias" } },
                {
                  type: "reply",
                  reply: { id: "lineas", title: "Ver otra línea" },
                },
                {
                  type: "reply",
                  reply: { id: "menu", title: "Menú principal" },
                },
              ]
            );
            break;
          case "4":
            await whatsappService.sendMessage(to, messages.TECNOLOGIAS_MESSAGE);
            await whatsappService.sendInteractiveButtons(
              to,
              "¿Necesitas ayuda adicional?",
              [
                { type: "reply", reply: { id: "terminar", title: "No, gracias" } },
                {
                  type: "reply",
                  reply: { id: "lineas", title: "Ver otra línea" },
                },
                {
                  type: "reply",
                  reply: { id: "menu", title: "Menú principal" },
                },
              ]
            );
            break;
          default:
            await whatsappService.sendMessage(
              to,
              messages.OPCION_INVALIDA_MESSAGE
            );
        }
        console.log("Eliminando estado del usuario");
        delete this.userState[user];
        console.log("Estado del usuario después de eliminar:", this.userState);
        return;
      }

      console.log("Verificando si es un saludo");
      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(user, senderInfo);
        await this.sendMainMenu(user);
      } else {
        console.log("Manejando opción del menú");
        await this.handleMenuOption(user, incomingMessage);
      }
      await whatsappService.markAsRead(message.id);
    } else if (message?.type === "interactive") {
      const user = message.from;
      const buttonId = message.interactive.button_reply.id;
      await this.handleButtonReply(user, buttonId);
      await whatsappService.markAsRead(message.id);
    }

    console.log("Estado del usuario al final:", this.userState);
  }

  isGreeting(message) {
    const greetings = ["hola", "hello", "hi", "buenas tardes"];
    return greetings.includes(message);
  }

  getSenderName(senderInfo) {
    console.log("senderInfo en getSenderName:", senderInfo);
    return senderInfo.profile?.name || senderInfo.wa_id;
  }

  async handleButtonReply(to, buttonId) {
    console.log("Respuesta de botón:", buttonId);
    switch (buttonId) {
      case "option_1":
        const latitude = 7.123456;
        const longitude = -73.123456;
        const name = "Tecnoparque Nodo Bucaramanga";
        const address = " Cl. 48 #28-40, Sotomayor, Bucaramanga";

        console.log("Enviando mensaje de ubicación");
        await whatsappService.sendLocationMessage(
          to,
          latitude,
          longitude,
          name,
          address
        );
        console.log("Mensaje de ubicación enviado");

        console.log("Enviando mensaje de horarios");
        await whatsappService.sendMessage(to, messages.HORARIOS_MESSAGE);
        console.log("Mensaje de horarios enviado");
        await whatsappService.sendInteractiveButtons(
          to,
          "¿Necesitas ayuda adicional?",
          [
            { type: "reply", reply: { id: "terminar", title: "No, gracias" } },
            { type: "reply",reply: { id: "menu", title: "Menú principal" },},
          ]
        );
        return;

      case "option_2":
        console.log("Enviando mensaje de lineas tecnologicas");
        await whatsappService.sendMessage(
          to,
          messages.LINEAS_TECNOLOGICAS_MESSAGE
        );
        console.log("Mensaje de lineas tecnologicas enviado");
        this.userState[to] = { action: "lineas_tecnologicas" };
        console.log("Estado del usuario actualizado:", this.userState);
        return;

      case "option_3":
        await whatsappService.sendMessage(to, messages.REQUISITOS_MESSAGE);
        await whatsappService.sendInteractiveButtons(
          to,
          "¿Necesitas ayuda adicional?",
          [
            { type: "reply", reply: { id: "terminar", title: "No, gracias" } },
            { type: "reply", reply: { id: "eventos", title: "Eventos" } },
            { type: "reply", reply: { id: "menu", title: "Menú principal" } },
          ]
        );
        return;

      case "option_4":
        await whatsappService.sendMessage(
          to,
          messages.REGISTRAR_PROYECTO_MESSAGE
        );
        return;

      case "option_5":
        await whatsappService.sendMessage(
          to,
          messages.CONSULTAR_PROYECTO_MESSAGE
        );
        return;

      case "menu":
        await this.sendMainMenu(to); // Volver al menú principal
        return;

      case "terminar":
        await whatsappService.sendMessage(
          to,
          `✨ ¡Entendido! 😊 Si en algún momento necesitas ayuda, solo escribe "Hola" y estaré aquí para asistirte. ¡Que tengas un gran día! 🚀`
        );
        return;
      
        case "eventos":
          console.log("Usuario seleccionó 'Eventos'");
          await this.handleMenuOption(to, "4");
          return;

      case "lineas":
        await whatsappService.sendMessage(
          to,
          messages.LINEAS_TECNOLOGICAS_MESSAGE
        ); 
        this.userState[to] = { action: "lineas_tecnologicas" };
        return;

      default:
        await whatsappService.sendMessage(to, messages.OPCION_INVALIDA_MESSAGE);
    }
  }

  async handleMenuOption(to, option) {
    console.log("Opción de menú:", option);
    switch (option) {
      case "1":
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

      case "4":
        await whatsappService.sendMessage(to, messages.EVENTOS_MESSAGE);
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
        await whatsappService.sendMessage(
          to,
          "Aquí tienes la información de contacto del Ing. Rafael Ramírez, nuestro mentor en Tecnoparque:"
        );

        await whatsappService.sendContactMessage(to, mentorContact);
        await whatsappService.sendInteractiveButtons(
          to,
          "¿Necesitas ayuda adicional?",
          [
            { type: "reply", reply: { id: "terminar", title: "No, gracias" } },
            { type: "reply", reply: { id: "eventos", title: "Eventos" } },
            { type: "reply", reply: { id: "menu", title: "Menú principal" } },
          ]
        );
        return;

      default:
        await whatsappService.sendMessage(to, messages.OPCION_INVALIDA_MESSAGE);
    }
  }
}

export default new MessageHandler();
