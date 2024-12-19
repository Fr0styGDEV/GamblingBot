const { EmbedBuilder } = require('discord.js');
const { calculateLevelCost } = require('../utils/levels');
const { getPlayerLevel } = require('../utils/levels');

module.exports = {
    names: ['price'],
    description: 'Calculate the total cost of buying a specified number of levels.',
    async execute(message, args) {
        const userId = message.author.id;

        // Validate the input
        const levelsToBuy = parseInt(args[0], 10);
        if (isNaN(levelsToBuy) || levelsToBuy <= 0) {
            return message.reply('Please specify a valid number of levels to calculate the cost for (e.g., `!price 5`).');
        }

        // Get the player's current level
        const currentLevel = getPlayerLevel(userId);

        // Calculate the total cost for the specified levels
        let totalCost = 0;
        for (let i = 0; i < levelsToBuy; i++) {
            totalCost += calculateLevelCost(currentLevel + i);
        }

        // Create the embed message
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🪙 Level Cost Calculator')
            .setDescription(
                `The total cost to buy **${levelsToBuy}** levels from your current level (**Level ${currentLevel}**) is **🪙 ${totalCost.toLocaleString()}**.`
            )
            .setFooter({ text: 'GamblingBOT® Level System' });

        // Send the embed message
        message.channel.send({ embeds: [embed] });
    },
};
