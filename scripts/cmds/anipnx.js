const axios = require('axios');

module.exports = {
  config: {
    name: "anipnx",
    aliases: ["pnx"],
    version: "1.0",
    author: "Rex",
    countDown: 5,
    role: 1,
    shortDescription: "get random waifu",
    longDescription: "Get waifu",
    category: "anime",
    guide: "{pn} {{<name>}}"
  },

  onStart: async function ({ message, args }) {
   
    const name = args.join(" ") || "waifu"; // 
    try {
      // Construct the API URL using the provided or default category
      let res = await axios.get(`https://api.waifu.pics/nsfw/${name}`);
      let res2 = res.data;
      let img = res2.url;

      
      const form = {
        body: `   「 Luccha Tor Jonno gift 🎁 」   ` // Custom message
      };

    
      if (img) {
        form.attachment = await global.utils.getStreamFromURL(img);
        message.reply(form);
      } else {
        // If no image is found in the response
        message.reply("❌ No waifu image found for this category.");
      }
    } catch (e) {
      // Error handling if the API call fails
      console.error(e);
      message.reply(`❌ Error: No waifu found for category "${name}"., fuck`);
    }
  }
};
