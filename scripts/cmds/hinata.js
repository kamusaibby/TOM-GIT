const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "hinata",
    version: "1.7",
    author: "MahMUD",
    countDown: 10,
    role: 0,
    category: "Image gen",
    guide: "{pn} [prompt]"
  },

  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage("Please provide a prompt to generate an image.", event.threadID, event.messageID);

    try {
      const waitingMessage = await message.reply(`🔄| Generate, your image,, please wait...`);

      const apiUrl = await baseApiUrl();
      if (!apiUrl) return api.sendMessage("Base API URL could not be loaded.", event.threadID, event.messageID);

      const res = await axios.post(`${apiUrl}/api/hinata`, { prompt });

      if (!res.data?.imageUrl) return api.sendMessage("Failed to generate image.", event.threadID, event.messageID);

      const imageStream = await global.utils.getStreamFromURL(res.data.imageUrl);

      setTimeout(() => {
        api.unsendMessage(waitingMessage.messageID);
      }, 1000);

      const messageSent = await api.sendMessage({
        body: "✅ Here is your generated image",
        attachment: imageStream
      }, event.threadID, event.messageID);

      api.setMessageReaction("🪽", messageSent.messageID, () => {}, true);

    } catch (err) {
      return api.sendMessage("An error occurred while generating the image.", event.threadID, event.messageID);
    }
  }
};
