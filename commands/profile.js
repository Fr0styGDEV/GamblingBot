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
        const amountOwned = userInvestment.amount;
        const priceAtPurchase = userInvestment.priceAtPurchase;
        const nickname = message.member.nickname || userLevel; 
        const readNickLevel = nickname.split(' ').slice(0, 4).join(' ');


        const userInfo = `<@${message.author.id}> 's GamblingBOT® Stats`;
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🪪 GamblingBOT® Profile')
            .setDescription(`${userInfo}`)
            .addFields(
                { name: 'Level:', value: `${readNickLevel.toLocaleString()}`, inline: true },
                { name: 'Balance:', value: `${userBalance.toLocaleString()} 🪙`, inline: true },
                { name: 'FrostyCoin®💎:', value: `${amountOwned.toLocaleString()} 💎 bought at ${priceAtPurchase.toFixed(2)} 🪙 each.`, inline: true },
            )
            .setFooter({ text: 'GamblingBOT®', })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};