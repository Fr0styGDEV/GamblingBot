const { EmbedBuilder } = require('discord.js');
const { getBalance, updateBalance, getUserInvestments, writeUserInvestments } = require('../utils/balance');
const { readCoinPrice } = require('../utils/coinPrice');  // Ensure this is the correct import

module.exports = {
    names: ['buy'],
    description: 'Buy coins in the stock market at the current coin price.',
    async execute(message, args) {
        const amount = parseInt(args[0]);

        // Validate amount
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Please specify a valid amount to buy.');
        }

        // Get the current coin price
        const coinPrice = readCoinPrice();
        if (isNaN(coinPrice)) {
            return message.reply('There was an issue retrieving the current coin price.');
        }

        // Get user's balance
        const balance = getBalance(message.author.id);
        const totalCost = amount * coinPrice;

        // Check if user can afford the purchase
        if (balance < totalCost) {
            return message.reply('You do not have enough coins to buy that amount.');
        }

        // Deduct cost from balance
        updateBalance(message.author.id, balance - totalCost);

        // Retrieve and update investments
        let investments = getUserInvestments(message.author.id);
        if (!investments) {
            investments = { amount: 0, priceAtPurchase: 0 };
        }

        // Calculate new weighted average price for multiple buys
        const totalCoinsBefore = investments.amount;
        const totalCoinsAfter = totalCoinsBefore + amount;
        investments.priceAtPurchase = 
            ((totalCoinsBefore * investments.priceAtPurchase) + (amount * coinPrice)) / totalCoinsAfter;

        // Update investment amount
        investments.amount = totalCoinsAfter;
        writeUserInvestments(message.author.id, investments);

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🚀 FrostyCoin®💎 Purchase')
            .setDescription(
                `You bought **${amount}** 💎 at **${coinPrice}** 🪙 each and spent **${totalCost.toLocaleString()}** 🪙.\n` +
                `Your new balance is **${(balance - totalCost).toLocaleString()}** 🪙.`
            )
            .setFooter({ text: 'GamblingBOT®' });

        // Send the embed
        message.channel.send({ embeds: [embed] });
    },
};
