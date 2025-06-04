module.exports = {
  config: {
    name: "tom2",
    version: "1.0.0",
    usePrefix: false,
    role: 0,
    author: "Eren",
    shortDescription: "Responds to 'tom' and 'kamu' with style",
    longDescription: "",
    category: "owner",
    credits: "Eren"
  },

  // Add an empty onStart function to resolve the error
  onStart: async function () {},

  onChat: async function ({ event, message }) {
    if (event.body && (event.body.toLowerCase().includes("tom") || event.body.toLowerCase().includes("kamu"))) {
      return message.reply({
        body: `┏━━━━━━◇◆◇━━━━━━┓

- 𝐍𝐚𝐦𝐞 :  卡姆鲁尔 

- 𝐅𝐨𝐫𝐦 : 𝐑𝐚𝐧𝐠𝐩𝐮𝐫

"𝐎𝐧𝐥𝐲 𝐭𝐡𝐨𝐬𝐞 𝐰𝐡𝐨 𝐚𝐛𝐚𝐧𝐝𝐨𝐧 𝐞𝐯𝐞𝐫𝐲𝐭𝐡𝐢𝐧𝐠 𝐜𝐚𝐧 𝐚𝐜𝐡𝐢𝐞𝐯𝐞 𝐚𝐧𝐲𝐭𝐡𝐢𝐧𝐠"  
"𝐈𝐟 𝐲𝐨𝐮 𝐰𝐢𝐧, 𝐲𝐨𝐮 𝐥𝐢𝐯𝐞. 𝐈𝐟 𝐲𝐨𝐮 𝐥𝐨𝐬𝐞, 𝐲𝐨𝐮 𝐝𝐢𝐞. 𝐈𝐟 𝐲𝐨𝐮 𝐝𝐨𝐧'𝐭 𝐟𝐢𝐠𝐡𝐭, 𝐲𝐨𝐮 𝐜𝐚𝐧'𝐭 𝐰𝐢𝐧"

╔════════════════╗
║     𝗦𝘁𝗮𝘁𝘂𝘀: 𝗦𝗺𝗼𝗼𝘁𝗵 🥵
╚════════════════╝
`,
        attachment: await global.utils.getStreamFromURL("https://files.catbox.moe/0cjtgp.mp4")
      });
    }
  }
}
