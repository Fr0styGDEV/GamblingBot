const { EmbedBuilder } = require('discord.js');
const { getBalance, updateBalance } = require('../utils/balance');

module.exports = {
    names: ['jackpot', 'jp'],
    description: 'Bet a certain amount of coins with the specified odds to multiply your bet.',
    async execute(message, args) {
        const betAmount = parseInt(args[0]);
        const odds = parseInt(args[1]);

        // Validate inputs
        if (isNaN(betAmount) || betAmount <= 0) {
            return message.reply('Please specify a valid amount to bet.');
        }
        if (odds < 2){
            return message.reply('Please specify valid odds (e.g., 2 for 2x, 10 for 10x).');
        }

        if (isNaN(odds) || odds <= 0) {
            return message.reply('Please specify valid odds (e.g., 2 for 2x, 10 for 10x).');
        }

        const balance = getBalance(message.author.id);
        if (betAmount > balance) {
            return message.reply('You do not have enough coins to gamble that amount.');
        }

        // Calculate the win/loss based on the odds
        const winChance = 1 / odds; // The chance of winning based on odds (e.g., 1/2 for 2x)
        const randomOutcome = Math.random() < winChance; // Random outcome based on odds

        // Calculate the result (whether the user wins or loses)
        const result = randomOutcome ? betAmount * odds : -betAmount;
        const newBalance = balance + result;

        // Update balance after gambling
        updateBalance(message.author.id, newBalance);

        // Create and send the embed with the result
        const embed = new EmbedBuilder()
            .setColor(result > 0 ? '#00ff00' : '#ff0000')
            .setTitle('🎰 Jackpot Result')
            .setDescription(`<@${message.author.id}>, Your new balance is: ${newBalance.toLocaleString()} 🪙.`)
            .addFields(
                { name: 'Bet Amount', value: `${betAmount.toLocaleString()} 🪙` },
                { name: 'Odds', value: `${odds}x` },
                { name: 'Result', value: result > 0 ? `You won ${result.toLocaleString()} 🪙!` : `You lost ${Math.abs(result).toLocaleString()} 🪙.` }
            )
            .setFooter({ text: 'GamblingBOT®' });

        message.channel.send({ embeds: [embed] });
    },
};
