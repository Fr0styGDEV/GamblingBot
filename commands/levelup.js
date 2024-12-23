const { getBalance, updateBalance } = require('../utils/balance');
const { getPlayerLevel, levelUpPlayer, calculateLevelCost, setPlayerLevel } = require('../utils/levels');
const { assignRole } = require('../utils/roles');
const { updateNick } = require('../utils/nickname');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    names: ['levelup'],
    description: 'Spend coins to level up and increase your rank! Specify how many levels to buy, e.g., `!levelup 3`.',
    async execute(message, args) {
        const userId = message.author.id;
        const currentBalance = getBalance(userId);
        const currentLevel = getPlayerLevel(userId);

        // Determine the number of levels to buy (default to 1 if not specified)
        const levelsToBuy = parseInt(args[0], 10) || 1;
        if (levelsToBuy <= 0) {
            return message.reply('Please specify a valid number of levels to buy (e.g., `!levelup 3`).');
        }

        // Calculate the total cost for the specified levels
        let totalCost = 0;
        for (let i = 0; i < levelsToBuy; i++) {
            totalCost += calculateLevelCost(currentLevel + i);
        }

        // Check if the user has enough coins
        if (currentBalance < totalCost) {
            return message.reply(
                `❌ You need 🪙 ${totalCost - currentBalance} more coins to buy **${levelsToBuy}** levels.`
            );
        }

        // Update balance and levels
        
        updateBalance(userId, currentBalance - totalCost);
        const newBalance = currentBalance - totalCost;

        const newLevel = currentLevel + levelsToBuy;
        setPlayerLevel(userId, newLevel);
 

        try { updateNick(message.member, newLevel, message.member.user.username, userId)
            await assignRole(message.member, newLevel, message.guild);
            const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🏅 Levelup! ⬆️')
            .setDescription(`<@${message.author.id}> 🎉 Congrats! You leveled up to **Level ${newLevel.toLocaleString()}**! It cost you 🪙 ${totalCost.toLocaleString()}.`)
            .addFields({ name: 'New Balance:', value: `${newBalance.toLocaleString()} 🪙.` })
            .setFooter({ text: 'GamblingBOT®' });

            message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error('Failed to update nickname or assign role:', err);
            message.reply(
                `You leveled up to **Level ${newLevel.toLocaleString()}**, and it cost you 🪙 ${totalCost.toLocaleString()}, but I couldn't update your nickname or roles due to permission issues.`
            );
        }
    },
};
