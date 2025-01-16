const { getPlayerLevel, calculateLevelRefund, calculateProfit } = require('../utils/levels');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    names: ['sellprofit'],
    description: 'calculate sell value`.',
    async execute(message, args) {
        const userId = message.author.id;
        const currentLevel = getPlayerLevel(userId);
        const levelsToSell = parseInt(args[0], 10) || 1;
        const value = calculateProfit(userId, levelsToSell)

        if (levelsToSell > currentLevel) {
            return message.reply(`You do not have enough levels to sell. Your current level is ${currentLevel}`);
        }
        if (levelsToSell < 0) {
            return message.reply(`You think im stupid?`);
        }
 
        const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('📈 💸 Profit Calculation💰')
        .setDescription(`<@${message.author.id}>, You sold **${levelsToSell} levels** for ${refundAmount.toLocaleString()} 🪙`)
        .addFields({ name: 'New Balance:', value: `${newBalance.toLocaleString()} 🪙.` })
        .setFooter({ text: 'GamblingBOT®' });

        message.channel.send({ embeds: [embed] });
    }
}