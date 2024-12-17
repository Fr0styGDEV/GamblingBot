const { EmbedBuilder } = require('discord.js');
const { getBalance, updateBalance } = require('../utils/balance');
const { readCoinPrice } = require('../utils/coinPrice');  // Import the function to read the current coin price
const fs = require('fs');
const path = require('path');

// Path to the investments JSON file
const investmentsFilePath = path.join(__dirname, '../storage/investments.json');

// Helper function to read the investments file
function readInvestments() {
    const data = fs.readFileSync(investmentsFilePath, 'utf8');
    return JSON.parse(data);
}

// Helper function to write to the investments file
function writeInvestments(investments) {
    fs.writeFileSync(investmentsFilePath, JSON.stringify(investments, null, 2));
}

module.exports = {
    names: ['sell'],
    description: 'Sell your stock and receive coins based on the current price.',
    async execute(message, args) {
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Please specify a valid amount to sell.');
        }

        // Read investments to check if the user has enough stock
        const investments = readInvestments();
        const currentInvestment = investments[message.author.id];
        if (!currentInvestment || currentInvestment.amount < amount) {
            return message.reply('You do not have enough stock to sell that amount.');
        }

        // Get the current coin price
        const coinPrice = readCoinPrice();
        // console.log('Current Coin Price:', coinPrice); // Get the latest price from coinPrice.js

        // Calculate the total sale value (current price times amount)
        const totalSaleValue = amount * coinPrice;

        // Calculate the total cost of the stock purchased at the time of purchase (purchase price times amount)
        const totalCost = amount * currentInvestment.priceAtPurchase;

        // Calculate profit or loss
        const profitOrLoss = totalSaleValue - totalCost;

        // Get the current balance
        const balance = getBalance(message.author.id);

        // Add the total sale value (not just profit or loss) to the balance
        const newBalance = balance + totalSaleValue;  // Add full sale value to balance

        // Update balance
        updateBalance(message.author.id, newBalance);

        // Update the investment amount
        currentInvestment.amount -= amount;
        if (currentInvestment.amount === 0) {
            delete investments[message.author.id]; // Remove user from investments if they sold all their stock
        } else {
            investments[message.author.id] = currentInvestment; // Update remaining stock
        }

        // Write updated investments back to the file
        writeInvestments(investments);

        // Create the embed response
        const embed = new EmbedBuilder()
            .setColor(profitOrLoss >= 0 ? '#00FF00' : '#FF0000')
            .setTitle(profitOrLoss >= 0 ? '📈 FrostyCoin®💎 Sale' : '📉 FrostyCoin®💎 Sale')
            .setDescription(profitOrLoss >= 0
                ? `You sold **${amount}** 💎 for **${totalSaleValue}** 🪙, earning a profit of **${profitOrLoss}🪙**. Your new balance is **${newBalance}** 🪙.`
                : `You sold **${amount}** 💎 for **${totalSaleValue}** 🪙, resulting in a loss of **${-profitOrLoss}🪙**. Your new balance is **${newBalance}** 🪙.`)
            .setFooter({ text: 'GamblingBOT®' });

        message.channel.send({ embeds: [embed] });
    },
};
