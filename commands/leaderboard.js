const { EmbedBuilder } = require('discord.js');
const { readBalances } = require('../utils/balance');
const { getPlayerLevel } = require('../utils/levels');

module.exports = {
    names: ['leaderboard', 'lb'],
    description: 'Displays the top 5 players based on their coin balance and levels.',
    async execute(message) {
        const balances = readBalances(); // Read balances.json
        const sortedBalances = Object.entries(balances)
            .sort(([, a], [, b]) => b - a) // Sort by balance descending
            .slice(0, 5); // Top 5 players

        // Fetch usernames, levels, and format leaderboard
        const leaderboard = await Promise.all(
            sortedBalances.map(async ([userId, balance], index) => {
                const placeEmoji = ['🥇', '🥈', '🥉', '🏅', '🏅'];
                let username;
                const level = getPlayerLevel(userId); // Get the user's level

                // Try to fetch the user from Discord
                try {
                    const user = await message.client.users.fetch(userId);
                    username = user.username;
                } catch {
                    username = `Unknown User (ID: ${userId})`; // Fallback
                }

                return `${placeEmoji[index]} **${username}** - ${balance.toLocaleString()} 🪙 (Lv. ${level})`;
            })
        );

        // Create embed message
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🏆 Leaderboard 🏆')
            .setDescription(leaderboard.join('\n'))
            .setFooter({ text: 'GamblingBOT®' })
            .setTimestamp();

        // Send embed
        message.channel.send({ embeds: [embed] });
    },
};
