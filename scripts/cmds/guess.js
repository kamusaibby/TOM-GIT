const cooldownTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const maxGuesses = 25;

module.exports = {
  config: {
    name: "guess",
    aliases: ["g"],
    version: "2.6",
    author: "𝐓𝐨𝐦 × 𝐆𝐩𝐭",
    description: "Guess the number (1-10) and win or lose coins!",
    usage: "[number]",
    cooldown: 10
  },

  onStart: async function ({ message, args, usersData, event }) {
    const userGuess = parseInt(args[0]);
    const userID = event.senderID;

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 10) {
      return message.reply("𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐚 𝐧𝐮𝐦𝐛𝐞𝐫 𝐛𝐞𝐭𝐰𝐞𝐞𝐧 𝟏 𝐚𝐧𝐝 𝟏𝟎!");
    }

    const userData = await usersData.get(userID);
    const currentBalance = userData.money || 0;

    // Get or initialize guess data
    const guessData = userData.guessGame || {
      count: 0,
      lastReset: 0
    };

    const now = Date.now();

    // Reset if more than cooldown time passed
    if (now - guessData.lastReset > cooldownTime) {
      guessData.count = 0;
      guessData.lastReset = now;
    }

    if (guessData.count >= maxGuesses) {
      const remainingTime = cooldownTime - (now - guessData.lastReset);
      const hours = Math.floor(remainingTime / (60 * 60 * 1000));
      const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

      return message.reply(`❌ | 𝐘𝐨𝐮 𝐡𝐚𝐯𝐞 𝐫𝐞𝐚𝐜𝐡𝐞𝐝 𝐲𝐨𝐮𝐫 𝐠𝐮𝐞𝐬𝐬 𝐥𝐢𝐦𝐢𝐭. 𝐓𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐢𝐧 ${hours}𝐡 ${minutes}𝐦.`);
    }

    if (currentBalance < 100) {
      return message.reply("𝐒𝐫𝐲 𝐬𝐢𝐫 𝐚𝐩𝐧𝐚𝐫 𝐭𝐤 𝐧𝐞𝐢 !!");
    }

    const randomNumber = Math.floor(Math.random() * 10) + 1;

    guessData.count += 1;

    // Update guess game data
    await usersData.set(userID, {
      money: currentBalance,
      guessGame: guessData
    });

    if (userGuess === randomNumber) {
      const newBalance = currentBalance + 1000;
      await usersData.set(userID, {
        money: newBalance,
        guessGame: guessData
      });

      return message.reply(`✅ 𝐂𝐨𝐫𝐫𝐞𝐜𝐭! 𝐘𝐨𝐮 𝐠𝐮𝐞𝐬𝐬𝐞𝐝 ${userGuess} 𝐚𝐧𝐝 𝐭𝐡𝐞 𝐧𝐮𝐦𝐛𝐞𝐫 𝐰𝐚𝐬 ${randomNumber}.\n𝐘𝐨𝐮 𝐰𝐨𝐧 𝟏𝟎𝟎𝟎 𝐜𝐨𝐢𝐧𝐬!\n𝐘𝐨𝐮𝐫 𝐧𝐞𝐰 𝐛𝐚𝐥𝐚𝐧𝐜𝐞 𝐢𝐬 ${newBalance} 𝐜𝐨𝐢𝐧𝐬.`);
    } else {
      const newBalance = currentBalance - 100;
      await usersData.set(userID, {
        money: newBalance,
        guessGame: guessData
      });

      return message.reply(`❌ 𝐖𝐫𝐨𝐧𝐠! 𝐘𝐨𝐮 𝐠𝐮𝐞𝐬𝐬𝐞𝐝 ${userGuess}, 𝐛𝐮𝐭 𝐭𝐡𝐞 𝐧𝐮𝐦𝐛𝐞𝐫 𝐰𝐚𝐬 ${randomNumber}.\n𝐘𝐨𝐮 𝐥𝐨𝐬𝐭 𝟏𝟎𝟎 𝐜𝐨𝐢𝐧𝐬.\n𝐘𝐨𝐮𝐫 𝐧𝐞𝐰 𝐛𝐚𝐥𝐚𝐧𝐜𝐞 𝐢𝐬 ${newBalance} 𝐜𝐨𝐢𝐧𝐬.`);
    }
  }
};
