const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: Object.freeze({
    name: "help",
    version: "1.20",
    author: "BaYjid (Modified by tom)",
    countDown: 5,
    role: 0,
    shortDescription: { en: "📖 View command usage" },
    longDescription: { en: "📜 View command usage and list all commands directly" },
    category: "ℹ️ Info",
    guide: { en: "🔹 {pn} [page] | {pn} <command> | {pn} -a <author> | {pn} -c <category>" },
    priority: 1,
  }),
  
  onStart: async function ({ message, args, event, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    
    // Handle single command help
    if (args.length > 0 && !args[0].startsWith("-") && !/^\d+$/.test(args[0])) {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));
      if (!command) return message.reply(`❌ Command "${commandName}" not found.`);
      
      const configCommand = command.config;
      const roleText = roleTextToString(configCommand.role);
      const usage = (configCommand.guide?.en || "No guide available.")
        .replace(/{pn}/g, prefix)
        .replace(/{n}/g, configCommand.name);
      
      return message.reply(
`┏━━━━━━━━━┓
┃𝐂𝐎𝐌𝐌𝐀𝐍𝐃 🦈 𝐈𝐍𝐅𝐎
┣━━━━━━━━━┫
┃ 🔹 𝐍𝐚𝐦𝐞: ${configCommand.name}
┃ 📄 𝐃𝐞𝐬𝐜: ${configCommand.longDescription?.en || "No description"}
┃ 🆔 𝐀𝐥𝐢𝐚𝐬𝐞𝐬: ${configCommand.aliases?.join(", ") || "None"}
┃ 📦 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: ${configCommand.version || "1.0"}
┃ 🛡️ 𝐑𝐨𝐥𝐞: ${roleText}
┃ ⏱️ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧: ${configCommand.countDown || 1}s
┃ 🧠 𝐀𝐮𝐭𝐡𝐨𝐫: ${configCommand.author || "Unknown"}
┃ 💠 𝐔𝐬𝐚𝐠𝐞: ${usage}
┗━━━━━━━━━┛`
      );
    }
    
    // Handle filters (-a author or -c category)
    let filterAuthor = null;
    let filterCategory = null;
    if (args[0] === "-a" && args[1]) {
      filterAuthor = args.slice(1).join(" ").toLowerCase();
    } else if (args[0] === "-c" && args[1]) {
      filterCategory = args.slice(1).join(" ").toLowerCase();
    }
    
    // Get all commands based on filters
    const allCommands = [];
    for (const [name, value] of commands) {
      const config = value.config;
      if (config.role > 1 && role < config.role) continue;
      if (filterAuthor && (config.author?.toLowerCase() !== filterAuthor)) continue;
      if (filterCategory && (config.category?.toLowerCase() !== filterCategory)) continue;
      allCommands.push({ name, category: config.category || "Uncategorized" });
    }
    
    if (allCommands.length === 0) {
      const filterMsg = filterAuthor ? `author "${filterAuthor}"` : `category "${filterCategory}"`;
      return message.reply(`❌ No commands found for ${filterMsg}.`);
    }
    
    // Sort commands by category then by name
    allCommands.sort((a, b) => {
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    
    // Split into pages (8 pages total)
    const commandsPerPage = Math.ceil(allCommands.length / 8);
    const totalPages = 8;
    let currentPage = parseInt(args[0]) || 1;
    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    const startIdx = (currentPage - 1) * commandsPerPage;
    const endIdx = Math.min(startIdx + commandsPerPage, allCommands.length);
    const pageCommands = allCommands.slice(startIdx, endIdx);
    
    // Group commands by category for display
    const categories = {};
    pageCommands.forEach(cmd => {
      if (!categories[cmd.category]) categories[cmd.category] = [];
      categories[cmd.category].push(cmd.name);
    });
    
    // Build the help message
    let msg = `┏━━[ 𝐁𝐎𝐓 𝐌𝐄𝐍𝐔 - 𝐏𝐚𝐠𝐞 ${currentPage}/${totalPages} ]━━┓\n`;
    
    Object.keys(categories).sort().forEach(category => {
      msg += `┃\n┃ ✦ 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲: ${category.toUpperCase()}\n`;
      categories[category].sort().forEach(cmd => msg += `┃    ⤷ ${cmd}\n`);
    });
    
    msg += `┃\n┣━━━━━━━━━━━━┫\n`;
    msg += `┃ 🦈 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬: ${allCommands.length}\n`;
    msg += `┃ 📘 𝐔𝐬𝐚𝐠𝐞: "${prefix}help <command>"\n`;
    msg += `┃ 📄 𝐔𝐬𝐚𝐠𝐞: "${prefix}help <page>"\n`;
    msg += `┗━━━━━━━━━━━━━┛`;
    
    await message.reply(msg);
  },
};

function roleTextToString(role) {
  switch (role) {
    case 0: return "🌎 All Users";
    case 1: return "👑 Group Admins";
    case 2: return "🤖 Bot Admins";
    default: return "❓ Unknown Role";
  }
}
