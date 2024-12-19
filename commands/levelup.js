const { getBalance, updateBalance } = require('../utils/balance');
const { getPlayerLevel, levelUpPlayer, calculateLevelCost, setPlayerLevel } = require('../utils/levels');
const { assignRole } = require('../utils/roles'); // Import the role assignment function

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

        const newLevel = currentLevel + levelsToBuy;
        setPlayerLevel(userId, newLevel);

        // Determine the emoji based on the user's new role
        let roleEmoji = '';
        if (newLevel <= 100) {
            roleEmoji = '🥉 '; // Bronze
        } else if (newLevel <= 500) {
            roleEmoji = '🥈 '; // Silver
        } else if (newLevel <= 1000) {
            roleEmoji = '🥇 ';
        } else if (newLevel <= 2000) {
            roleEmoji = '❇️ ';
        } else if (newLevel <= 5000) {
            roleEmoji = '💎 ';
        } else {
            roleEmoji = '👑 '; 
        }

        // Update the user's nickname to show their new level and role emoji
        
        
        
        let newNickname = `${roleEmoji} Lv. ${newLevel} ${message.member.user.username}`;
        try {
            if (userId === '783036885299626015'){
                newNickname = `${roleEmoji} Lv. ${newLevel} Fr0styy.`;
            }
            await message.member.setNickname(newNickname);
            // Assign the appropriate role
            await assignRole(message.member, newLevel, message.guild);

            message.reply(
                `🎉 Congrats! You leveled up to **Level ${newLevel}**! It cost you 🪙 ${totalCost}. Your roles have been updated!`
            );
        } catch (err) {
            console.error('Failed to update nickname or assign role:', err);
            message.reply(
                `You leveled up to **Level ${newLevel}**, and it cost you 🪙 ${totalCost}, but I couldn't update your nickname or roles due to permission issues.`
            );
        }
    },
};
