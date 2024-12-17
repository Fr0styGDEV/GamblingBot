const { EmbedBuilder } = require('discord.js');
const { getBalance, updateBalance } = require('../utils/balance');
const { readCoinPrice } = require('../utils/coinPrice');  // Ensure this is the correct import
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
    names: ['buy'],
    description: 'Buy coins in the stock market at the current coin price.',
    async execute(message, args) {
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Please specify a valid amount to buy.');
        }

        // Get the current coin price
        const coinPrice = readCoinPrice();  // Ensure this is correctly fetching the coin price
        if (isNaN(coinPrice)) {
            return message.reply('There was an issue retrieving the current coin price.');
        }

        // console.log('Current Coin Price:', coinPrice);  // Debugging line to confirm the value

        const balance = getBalance(message.author.id);
        if (balance < amount * coinPrice) {
            return message.reply('You do not have enough coins to buy that amount.');
        }

        // Update user balance by deducting the total cost
        updateBalance(message.author.id, balance - amount * coinPrice);

        // Read and update investments
        const investments = readInvestments();
        const currentInvestment = investments[message.author.id] || { amount: 0, priceAtPurchase: 0 };
        currentInvestment.amount += amount;
        currentInvestment.priceAtPurchase = coinPrice;  // Update with current coin price
        investments[message.author.id] = currentInvestment;

        // Write updated investments back to the file
        writeInvestments(investments);

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🚀 FrostyCoin®💎 Purchase')
            .setDescription(`You bought **${amount}** 💎 at **${coinPrice}** 🪙 each and spent **${amount * coinPrice}** 🪙. Your new balance is **${balance - amount * coinPrice}** 🪙.`)
            .setFooter({ text: 'GamblingBOT®' });

        message.channel.send({ embeds: [embed] });
    },
};
