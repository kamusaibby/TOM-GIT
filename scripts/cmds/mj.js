const axios = require('axios');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function createImageGrid(urls) {
  const images = await Promise.all(urls.map(url => loadImage(url)));

  const maxWidth = Math.max(...images.map(img => img.width));
  const maxHeight = Math.max(...images.map(img => img.height));

  const canvas = createCanvas(maxWidth * 2, maxHeight * 2);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(images[0], 0, 0, images[0].width, images[0].height);
  ctx.drawImage(images[1], maxWidth, 0, images[1].width, images[1].height);
  ctx.drawImage(images[2], 0, maxHeight, images[2].width, images[2].height);
  ctx.drawImage(images[3], maxWidth, maxHeight, images[3].width, images[3].height);

  return canvas.toBuffer('image/jpeg');
}

module.exports = {
  config: {
    name: 'mj',
    aliases: ["midjourney"],
    version: '1.0',
    author: 'Amit Max ⚡',
    countDown: 15,
    role: 2,
    shortDescription: 'Generate an image using Midjourney (might be unstable).',
    longDescription: 'Generate a MidJourney image combining all four variations.',
    category: 'image',
    guide: '{pn} [prompt]'
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0]) return api.sendMessage("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐩𝐫𝐨𝐦𝐩𝐭.\n𝐄𝐱𝐞𝐦𝐩𝐥𝐞: ! 𝐌𝐣 𝐚 𝐜𝐚𝐭 𝐰𝐢𝐭𝐡 𝐬𝐮𝐧𝐠𝐥𝐚𝐬𝐬", event.threadID);

    const prompt = args.join(' ');
    const loading = await api.sendMessage("𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞 𝐘𝐨𝐮𝐫 𝐈𝐦𝐚𝐠𝐞, 𝐏𝐥𝐞𝐚𝐬𝐞 𝐖𝟖...!! ⏳", event.threadID);

    try {
      const res = await axios.get(`https://zaikyoov3-up.up.railway.app/api/mj-proxy-pub?prompt=${encodeURIComponent(prompt)}`);
      const imageUrls = res.data.results;

      if (!imageUrls || imageUrls.length < 4) throw new Error("We received fewer than the expected 4 images.");

      const gridBuffer = await createImageGrid(imageUrls);
      const gridPath = `grid_${event.threadID}.jpg`;
      fs.writeFileSync(gridPath, gridBuffer);

      const msg = await api.sendMessage({
        body: "𝐒𝐞𝐥𝐞𝐜𝐭 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞 𝐛𝐲 𝐫𝐞𝐩𝐥𝐲𝐢𝐧𝐠 𝐰𝐢𝐭𝐡 𝐔𝟏, 𝐔𝟐, 𝐔𝟑, 𝐎𝐫 𝐔𝟒",
        attachment: fs.createReadStream(gridPath)
      }, event.threadID);

      global.GoatBot.onReply.set(msg.messageID, {
        commandName: this.config.name,
        author: event.senderID,
        imageUrls
      });

      
      setTimeout(() => {
        fs.unlink(gridPath, err => {
          if (err) console.error(`Deletion error ${gridPath}:`, err);
        });
      }, 50000);

      await api.unsendMessage(loading.messageID);
    } catch (err) {
      console.error(err);
      await api.unsendMessage(loading.messageID);
      api.sendMessage("An error occurred while generating the image.", event.threadID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { author, imageUrls } = Reply;
    if (event.senderID !== author) return;

    const choice = event.body.trim().toUpperCase();
    const validChoices = ["U1", "U2", "U3", "U4"];
    if (!validChoices.includes(choice)) {
      return api.sendMessage("❌ Reply with U1, U2, U3, or U4.", event.threadID);
    }

    const index = parseInt(choice.slice(1)) - 1;
    const url = imageUrls[index];
    const path = `variante_${choice}_${event.threadID}.jpg`;

    try {
      const response = await axios.get(url, { responseType: 'stream' });
      const writer = fs.createWriteStream(path);

      response.data.pipe(writer);

      writer.on('finish', () => {
        api.sendMessage({
          body: `🌌 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 ${choice}`,
          attachment: fs.createReadStream(path)
        }, event.threadID);

      
        setTimeout(() => {
          fs.unlink(path, err => {
            if (err) console.error(`Deletion error ${path}:`, err);
          });
        }, 60000);
      });

      writer.on('error', () => {
        api.sendMessage("❌ An error occurred while saving the image.", event.threadID);
      });
    } catch (err) {
      console.error("An error occurred while fetching the image: ", err);
      return api.sendMessage("❌ Error while retrieving the image.", event.threadID);
    }
  }
};
