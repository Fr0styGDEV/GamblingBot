const { EmbedBuilder } = require('discord.js');
const { getPlayerLevel } = require('../utils/levels');

module.exports = {
    names: ['leaderboard', 'lb'],
    description: 'Displays the top 5 players based on their levels.',
    async execute(message) {
        try {
            // Read all players' levels from the levels.json file
            const levelsData = require('../storage/levels.json');

            // Convert the levels object to an array and sort by levels in descending order
            const sortedLevels = Object.entries(levelsData)
                .map(([userId, level]) => ({ userId, level }))
                .sort((a, b) => b.level - a.level)
                .slice(0, 5); // Top 5 players

            if (sortedLevels.length === 0) {
                return message.reply('No players found with levels.');
            }

            // Format leaderboard
            const leaderboard = await Promise.all(
                sortedLevels.map(async ({ userId, level }, index) => {
                    const placeEmoji = ['🥇', '🥈', '🥉', '🏅', '🏅'];
                    let username;

                    try {
                        const user = await message.client.users.fetch(userId);
                        username = user.username;
                    } catch {
                        username = `Unknown User (ID: ${userId})`; // Fallback if user fetch fails
                    }

                    return `${placeEmoji[index]} **${username}** - Lv. ${level}`;
                })
            );

            // Create the embed
            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('🏆 Level Leaderboard 🏆')
                .setDescription(leaderboard.join('\n'))
                .setFooter({ text: 'GamblingBOT®' })
                .setTimestamp();

            // Send the embed
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error executing leaderboard command:', error);
            message.reply('An error occurred while fetching the leaderboard. Please try again later.');
        }
    },
};
