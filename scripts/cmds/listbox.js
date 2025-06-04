module.exports = {
    config: {
        name: "listbox",
        aliases: ["l"],
        author: "kshitiz",
        version: "2.0",
        cooldowns: 5,
        role: 2,
        shortDescription: {
            en: "List all group chats the bot is in."
        },
        longDescription: {
            en: "Use this command to list all group chats the bot is currently in."
        },
        category: "owner",
        guide: {
            en: "{p}{n}"
        }
    },
    onStart: async function ({ api, event }) {
        try {
            const groupList = await api.getThreadList(100, null, ['INBOX']);

            // শুধু গ্রুপ চ্যাট ফিল্টার করা
            const filteredList = groupList.filter(group => group.isGroup);

            if (filteredList.length === 0) {
                await api.sendMessage('No group chats found.', event.threadID);
            } else {
                const formattedList = filteredList.map((group, index) =>
                    `│${index + 1}. ${group.name || "Unnamed Group"}\n│𝐓𝐈𝐃: ${group.threadID}`
                );

                const message = `╭─╮\n│𝐋𝐢𝐬𝐭 𝐨𝐟 𝐠𝐫𝐨𝐮𝐩 𝐜𝐡𝐚𝐭𝐬:\n${formattedList.join("\n")}\n╰───────────ꔪ`;
                await api.sendMessage(message, event.threadID, event.messageID);
            }
        } catch (error) {
            console.error("Error listing group chats", error);
            await api.sendMessage("An error occurred while fetching the group list.", event.threadID);
        }
    },
};
