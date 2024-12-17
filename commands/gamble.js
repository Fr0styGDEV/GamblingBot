const { EmbedBuilder } = require('discord.js');
const { getBalance, updateBalance } = require('../utils/balance');

module.exports = {
    names: ['gamble', 'g'],
    description: 'Gamble a certain amount of coins (50/50 chance to double or lose the amount).',
    async execute(message, args) {
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Please specify a valid amount to gamble.');
        }

        const balance = getBalance(message.author.id);
        if (amount > balance) {
            return message.reply('You do not have enough coins to gamble that amount.');
        }

        const result = Math.random() < 0.5 ? -amount : amount; // 50/50 chance
        const newBalance = balance + result;

        updateBalance(message.author.id, newBalance); // Update balance after gambling

        const embed = new EmbedBuilder()  // Use EmbedBuilder here
            .setColor(result > 0 ? '#00ff00' : '#ff0000')
            .setTitle('🎰 Gambling Result')
            .setDescription(`<@${message.author.id}>, Your new balance is: ${newBalance.toLocaleString()} 🪙.`)
            .addFields({ name: 'Result', value: result > 0 ? 'You won!' : 'You lost!' })
            .setFooter({ text: 'GamblingBOT®' });

        message.channel.send({ embeds: [embed] });
    },
};
