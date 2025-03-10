import axios from "axios";
import config from "../../config/env.js";

const sendToWhatsApp = async (data) => {
  if (!config.BASE_URL || !config.API_VERSION || !config.BUSINESS_PHONE || !config.API_TOKEN) {
    throw new Error("Faltan configuraciones en env.js");
  }

  const baseUrl = `${config.BASE_URL}/${config.API_VERSION}/${config.BUSINESS_PHONE}/messages`;
  const headers = {
    Authorization: `Bearer ${config.API_TOKEN}`,
    "Content-Type": "application/json"
  };

  try {
    const response = await axios.post(baseUrl, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error al enviar mensaje a WhatsApp:", error);
    if (error.response) {
      console.error("Respuesta de la API:", error.response.data);
    }
    throw new Error("No se pudo enviar el mensaje a WhatsApp");
  }
};

export default sendToWhatsApp;