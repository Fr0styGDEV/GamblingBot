const { EmbedBuilder } = require('discord.js');
const { writeCoinPrice } = require('../utils/coinPrice');

module.exports = {
    names: ['resetcoin'],
    description: 'Reset the FrostyCoin price to a specified value. (Admin Only)',
    async execute(message, args) {
        const adminId = '783036885299626015'; // Authorized user ID

        // Check if the user is authorized
        if (message.author.id !== adminId) {
            return message.reply('❌ You do not have permission to use this command.');
        }

        // Validate the specified price
        const newPrice = parseInt(args[0], 10);
        if (isNaN(newPrice) || newPrice <= 0) {
            return message.reply('❌ Please specify a valid price (e.g., `!resetcoin 100`).');
        }

        // Update the FrostyCoin price
        writeCoinPrice(newPrice);

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('FrostyCoin Price Reset')
            .setDescription(`✅ FrostyCoin®💎 price has been reset to **${newPrice}** 🪙.`)
            .setFooter({ text: 'Admin Action' });

        message.channel.send({ embeds: [embed] });
    },
};
