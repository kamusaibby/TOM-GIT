const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 𝐓𝐎𝐌 ]";

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "ArYan",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);
    if (args.length === 0) {
      const categories = {};
      let msg = "╭───────❁";
      msg += `\n│𝐁𝐚𝐛𝐲 𝐇𝐞𝐥𝐩 𝐋𝐢𝐬𝐭 \n╰────────────❁`;
      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;
        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }
      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭─────✰『  ${category.toUpperCase()}  』`;
          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 2).map((item) => `⭔${item}`);
            msg += `\n│${cmds.join(" ".repeat(Math.max(1, 5 - cmds.join("").length)))}`;
          }
          msg += `\n╰────────────✰`;
        }
      });
      const totalCommands = commands.size;
      msg += `\n\n╭─────✰[𝗕𝗔'𝗕𝗬 くめ]\n│>𝐓𝐨𝐭𝐚𝐥 𝐂𝐦𝐝𝐬: [${totalCommands}].\n╰────────────✰`;
      msg += ``;
      msg += `\n╭─────✰\n│ ╣[卡姆鲁尔]╠\n╰────────────✰`;
      const helpListImages = [
        "https://files.catbox.moe/4ox6ty.gif",
      ];
      const helpListImage =
        helpListImages[Math.floor(Math.random() * helpListImages.length)];
      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage),
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command =
        commands.get(commandName) || commands.get(aliases.get(commandName));
      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";
        const longDescription = configCommand.longDescription
          ? configCommand.longDescription.en || "No description"
          : "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody
          .replace(/{p}/g, prefix)
          .replace(/{n}/g, configCommand.name);
        const response = `
  ╭───⊙
  │ 🔶 ${configCommand.name}
  ├── INFO
  │ 📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${longDescription}
  │ 👑 𝗔𝘂𝘁𝗵𝗼𝗿: ${author}
  │ ⚙ 𝗚𝘂𝗶𝗱𝗲: ${usage}
  ├── USAGE
  │ 🔯 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${configCommand.version || "1.0"}
  │ ♻𝗥𝗼𝗹𝗲: ${roleText}
  ╰────────────⊙`;
        await message.reply(response);
      }
    }
  },

  onChat: async function ({ message, event, threadsData, usersData }) {
    const body = (event.body || "").toLowerCase().trim();
    const prefix = global.GoatBot.config.prefix;

    // Triggers that support prefix and no prefix
    const triggers = ["help", `${prefix}help`];

    if (!triggers.some((cmd) => body.startsWith(cmd))) return;

    // Remove the command word ("help" or "!help") and split the rest as args
    let args = body.split(/\s+/);
    if (args[0].startsWith(prefix)) {
      args[0] = args[0].slice(prefix.length);
    }
    args = args.slice(1);

    await module.exports.onStart({
      message,
      event,
      args,
      threadsData,
      usersData,
      role: 0, // default role, change if you want
    });
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
}
