const { EmbedBuilder } = require('discord.js');
const { getBalance, updateBalance } = require('../utils/balance'); 

module.exports = {
    names: ['give'],
    description: 'Give an amount of coins to another player.',
    async execute(message, args) {
        // Check if the correct number of arguments are provided
        if (args.length < 2) {
            return message.reply('Please specify a user and the amount of coins to give.');
        }

        // Get the recipient and amount
        const recipient = message.mentions.users.first();  // This handles @mention or username
        const amount = parseInt(args[1], 10);  // Get the amount from the second argument

        // Check if recipient is valid
        if (!recipient) {
            return message.reply('Please mention a valid user to give coins to.');
        }

        // Check if the amount is a valid number and greater than zero
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Please specify a valid amount greater than 0.');
        }

        // Check if the sender has enough coins (using your balance storage)
        const senderBalance = getBalance(message.author.id); // Replace with your method to get balance
        if (senderBalance < amount) {
            return message.reply('You don\'t have enough coins to give that amount.');
        }

        // Calculate new balances
        const newSenderBalance = senderBalance - amount;
        const recipientBalance = getBalance(recipient.id); // Get recipient's current balance
        const newRecipientBalance = recipientBalance + amount;

        // Update balances (subtract from sender and add to recipient)
        updateBalance(message.author.id, newSenderBalance); // Deduct coins from sender
        updateBalance(recipient.id, newRecipientBalance); // Add coins to recipient

        // Create the embed message using EmbedBuilder
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('💸 Coins Transferred')
            .setDescription(`${message.author.username} gave **${amount}** 🪙 to ${recipient.username}.`)
            .addFields(
                { name: 'Your New Balance', value: `${newSenderBalance.toLocaleString()} 🪙`, inline: true },
                { name: `${recipient.username}'s New Balance`, value: `${newRecipientBalance.toLocaleString()} 🪙`, inline: true }
            )
            .setTimestamp();

        // Send the embed message
        message.reply({ embeds: [embed] });
    },
};
