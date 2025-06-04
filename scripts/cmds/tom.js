module.exports = {
  config: {
    name: "tom",
    version: "1.0",
    author: "AceGun",
    countDown: 5,
    role: 0,
    shortDescription: "Call Tom",
    longDescription: "Responds when Tom is mentioned",
    category: "fun",
  },

  onStart: async function() {}, // ফাংশনটি যোগ করা হয়েছে

  onChat: async function({ event, message }) {
    if (event.body?.toLowerCase() === "tom") {
      try {
        const attachment = await global.utils.getStreamFromURL("http://remakeai-production.up.railway.app/Remake_Ai/Nyx_Remake_1746959384840.mp4");
        
        return message.reply({
          body: `┏✦━━━━━━━━━━━━✦┓
          
  ✦  𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮𝐚𝐥𝐚𝐢𝐤𝐮𝐦 ✦
  
        『 𝐘𝐨𝐮𝐫 𝐁𝐨𝐲 』
        『 ‎卡姆鲁尔 』
  
         𝐎𝐰𝐧𝐞𝐫 × 𝐓𝐨𝐦
          
┗✦━━━━━━━━━━━━✦┛`,
          attachment: attachment
        });
      } catch (error) {
        console.error("Error in tom command:", error);
        return message.reply("𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮𝐚𝐥𝐚𝐢𝐤𝐮𝐦! Your boy is here but there was a technical issue.");
      }
    }
  }
}
