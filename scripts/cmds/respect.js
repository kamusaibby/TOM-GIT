module.exports = {
    config: {
      name: "respect",
      aliases: [],
      version: "1.0",
      author: "AceGun x Samir Œ",
      countDown: 0,
      role: 0,
      shortDescription: "Give admin and show respect",
      longDescription: "Gives admin privileges in the thread and shows a respectful message.",
      category: "owner",
      guide: "{pn} respect",
    },

    onStart: async function ({ message, args, api, event }) {
      try {
        console.log('Sender ID:', event.senderID);

        const permission = ["61552930114349"];
        if (!permission.includes(event.senderID)) {
          return api.sendMessage(
            "𝐈 𝐨𝐧𝐥𝐲 𝐫𝐞𝐬𝐩𝐞𝐜𝐭 𝐦𝐲 𝐛𝐨𝐬𝐬 𝐊𝐚𝐦𝐮 𝐚𝐧𝐝 𝐧𝐨 𝐨𝐧𝐞 𝐞𝐥𝐬𝐞 𝐨𝐤𝐚𝐲 😾 ",
            event.threadID,
            event.messageID
          );
        }

        const threadID = event.threadID;
        const adminID = event.senderID;

        // Change the user to an admin
        await api.changeAdminStatus(threadID, adminID, true);

        api.sendMessage(
          `𝐌𝐲 𝐁𝐨𝐬𝐬, 𝐈 𝐫𝐞𝐬𝐩𝐞𝐜𝐭 𝐲𝐨𝐮 𝐟𝐫𝐨𝐦 𝐦𝐲 𝐜𝐨𝐫𝐞 𝐨𝐟 𝐡𝐞𝐚𝐫𝐭 🌚`,
          threadID
        );
      } catch (error) {
        console.error("Error promoting user to admin:", error);
        api.sendMessage("𝐌𝐲 𝐋𝐨𝐫𝐝, 𝐈 𝐜𝐚𝐧𝐭 𝐀𝐝𝐝 𝐘𝐨𝐮 𝐀𝐬 𝐀𝐧 𝐀𝐝𝐦𝐢𝐧 𝐈𝐧 𝐓𝐡𝐢𝐬 𝐆𝐫𝐨𝐮𝐩. 😓", event.threadID);
      }
    },
  };
