module.exports = {
  config: {
    name: "tombot14",
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
    if (text === "tom koi") {
      return message.reply("𝐓𝐨𝐦 𝐛𝐮𝐬𝐲 𝐚𝐜𝐡𝐞 𝐣𝐚 𝐯𝐚𝐠  !!");
    }
  }
};
