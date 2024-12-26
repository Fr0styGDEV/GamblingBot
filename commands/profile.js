const { EmbedBuilder } = require('discord.js');
const { getBalance, getUserInvestments } = require('../utils/balance');
const { getPlayerLevel } = require('../utils/levels');

module.exports = {
    names: ['profile', 'pf'],
    description: 'Display user profile',
    async execute(message) {
        const userId = message.author.id;
        const userBalance = getBalance(userId);
        const userLevel = getPlayerLevel(userId);
        const userInvestment = getUserInvestments(userId);
        const amountOwned = userInvestment ? userInvestment.amount : 0;
        const priceAtPurchase = userInvestment ? userInvestment.priceAtPurchase : 0;
        const nickname = message.member.nickname || userLevel; 
        const readNickLevel = nickname.split(' ').slice(0, 4).join(' ');
        const userFcInfo = amountOwned > 0
            ? `${amountOwned.toLocaleString()} 💎 bought at ${priceAtPurchase.toFixed(2)} each. Worth ${(amountOwned * currentValue).toLocaleString()} 🪙 at current FrostyCoin®💎 Value`
            : `<@${message.author.id}>, you currently don\'t own any FrostyCoin.`;


        const userInfo = `<@${message.author.id}> 's GamblingBOT® Stats`;
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🪪 GamblingBOT® Profile')
            .setDescription(`${userInfo}`)
            .addFields(
                { name: 'Level:', value: `${readNickLevel.toLocaleString()}`, inline: true },
                { name: 'Balance:', value: `${userBalance.toLocaleString()} 🪙`, inline: true },
                { name: 'FrostyCoin®💎:', value: `${userFcInfo}`, inline: true },
            )
            .setFooter({ text: 'GamblingBOT®', })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};