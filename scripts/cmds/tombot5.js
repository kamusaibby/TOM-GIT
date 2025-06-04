module.exports = {
  config: {
    name: "tombot5",
    version: "1.0",
    author: "𝐓𝐎𝐌 🦆💨",
    countDown: 1,
    role: 0,
    shortDescription: "Reply to 'tom'",
    longDescription: "Replies with a fixed message when someone says 'tom'",
    category: "fun",
    guide: "Just type: tom"
  },

  onStart: async function () {
    // Nothing needed here
  },

  onChat: async function ({ event, message }) {
    const text = (event.body || "").toLowerCase().trim();
    if (text === "kamrul ke") {
      return message.reply("𝐏𝐢𝐜𝐜𝐡𝐢 𝐬𝐚𝐢𝐦𝐚𝐫 𝐣𝐚𝐦𝐚𝐢 𝐭𝐨𝐠𝐨 𝐝𝐮𝐥𝐚𝐯𝐚𝐢 𝐥𝐚𝐠𝐞 𝐛𝐮𝐣𝐡𝐬𝐨𝐬𝐡 😒");
    }
  }
};
