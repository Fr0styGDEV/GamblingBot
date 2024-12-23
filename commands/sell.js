const { EmbedBuilder } = require('discord.js');
const { getBalance, updateBalance, getUserInvestments, writeUserInvestments } = require('../utils/balance');
const { readCoinPrice } = require('../utils/coinPrice');  // Import the function to read the current coin price

module.exports = {
    names: ['sell'],
    description: 'Sell your stock and receive coins based on the current price.',
    async execute(message, args) {
        const amount = parseInt(args[0]);
        const currentInvestment = getUserInvestments(message.author.id);

        if (isNaN(amount) || amount <= 0) {
            return message.reply('Please specify a valid amount to sell.');
        }

        if (!currentInvestment || currentInvestment.amount < amount) {
            return message.reply('You do not have enough stock to sell that amount.');
        }

        // Get the current coin price
        const coinPrice = readCoinPrice();
        const totalSaleValue = amount * coinPrice;
        const totalCost = amount * currentInvestment.priceAtPurchase;
        const profitOrLoss = totalSaleValue - totalCost;

        // Update user balance
        const balance = getBalance(message.author.id);
        const newBalance = balance + totalSaleValue;
        updateBalance(message.author.id, newBalance);

        // Update the investment amount
        currentInvestment.amount -= amount;

        // Remove investment if amount is 0
        if (currentInvestment.amount === 0) {
            writeUserInvestments(message.author.id, null); // Remove investment
        } else {
            writeUserInvestments(message.author.id, currentInvestment); // Update investment
        }

        // Create the embed response
        const embed = new EmbedBuilder()
            .setColor(profitOrLoss >= 0 ? '#00FF00' : '#FF0000')
            .setTitle(profitOrLoss >= 0 ? '📈 FrostyCoin®💎 Sale' : '📉 FrostyCoin®💎 Sale')
            .setDescription(profitOrLoss >= 0
                ? `You sold **${amount}** 💎 for **${totalSaleValue.toLocaleString()}** 🪙, earning a profit of **${profitOrLoss.toLocaleString()}🪙**. Your new balance is **${newBalance.toLocaleString()}** 🪙.`
                : `You sold **${amount}** 💎 for **${totalSaleValue.toLocaleString()}** 🪙, resulting in a loss of **${(-profitOrLoss).toLocaleString()}🪙**. Your new balance is **${newBalance.toLocaleString()}** 🪙.`)
            .setFooter({ text: 'GamblingBOT®' });

        message.channel.send({ embeds: [embed] });
    },
};
