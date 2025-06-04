module.exports = {
  config: {
    name: "add",
    aliases: [],
    version: "1.0",
    author: "Mahi (Modified by tom)",
    countDown: 10,
    role: 1,
    shortDescription: "Add anyone to group",
    longDescription: "Add someone to the group by replying to their message or using UID.",
    category: "group",
    guide: "Reply to a message or use: {pn} [uid]"
  },

  onStart: async function ({ api, event, args }) {
    const threadID = event.threadID;
    let targetUID;

    if (args[0]) {
      targetUID = args[0];
    } else if (event.messageReply) {
      targetUID = event.messageReply.senderID;
    } else {
      return api.sendMessage("⚠️ 𝐑𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚 𝐦𝐞𝐬𝐬𝐚𝐠𝐞 𝐨𝐫 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐮𝐢𝐝  !!", threadID);
    }

    try {
      await api.addUserToGroup(targetUID, threadID);
      const userInfo = await api.getUserInfo(targetUID);
      const userName = userInfo[targetUID]?.name || "Unknown";

      const toFancy = (text) => {
        const offset = { upper: 0x1D400 - 65, lower: 0x1D41A - 97 };
        return text.split("").map(c => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCharCode(code + offset.upper);
          if (code >= 97 && code <= 122) return String.fromCharCode(code + offset.lower);
          return c;
        }).join("");
      };

      const fancyName = toFancy(userName);

      api.sendMessage(`✅ 𝐀𝐝𝐝𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲: ${fancyName}`, threadID);

    } catch (err) {
      api.sendMessage(`❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐚𝐝𝐝: ${err.message}`, threadID);
    }
  }
};
