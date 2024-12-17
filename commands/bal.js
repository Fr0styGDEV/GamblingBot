const { EmbedBuilder } = require('discord.js');
const { getBalance } = require('../utils/balance');

module.exports = {
    names: ['bal', 'b'],
    description: 'Check your balance.',
    execute(message) {
        const balance = getBalance(message.author.id);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🏦 Balance Check 💰')
            .setDescription(`<@${message.author.id}>, your balance is: ${balance.toLocaleString()} 🪙.`)
            .setFooter({ text: 'GamblingBOT®' });

        message.channel.send({ embeds: [embed] });
    },
};
