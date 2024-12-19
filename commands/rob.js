const { EmbedBuilder } = require('discord.js');
const { getBalance, updateBalance } = require('../utils/balance');

module.exports = {
    names: ['rob', 'r'],
    description: 'Rob another player (50/50 chance to steal coins).',
    async execute(message, args) {
        const targetUser = message.mentions.users.first();
        // if (message.author.id == 1025904820302921760) {
        //     return message.reply(`<@${message.author.id}> is not allowed to use !rob`);
        // }
        if (!targetUser) {
            return message.reply('Please mention a user to rob.');
        }

        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount <= 0) {
            return message.reply('Please specify a valid amount to rob.');
        }

        const robberBalance = getBalance(message.author.id);
        if (amount > robberBalance) {
            return message.reply('You do not have enough coins to rob that amount.');
        }

        const targetBalance = getBalance(targetUser.id);
        if (amount > targetBalance) {
            return message.reply('The target does not have enough coins to rob that amount.');
        }

        const success = Math.random() < 0.5; // 50/50 chance

        if (success) {
            // Successful robbery: subtract from target and add to robber
            updateBalance(message.author.id, robberBalance + amount); // New balance for robber
            updateBalance(targetUser.id, targetBalance - amount); // New balance for target
        } else {
            // Failed robbery: subtract from robber and add to target
            updateBalance(message.author.id, robberBalance - amount); // New balance for robber
            updateBalance(targetUser.id, targetBalance + amount); // New balance for target
        }

        const embed = new EmbedBuilder()
            .setColor(success ? '#00ff00' : '#ff0000')
            .setTitle('🥷 Robbery Result 💰')
            .setDescription(success
                ? `<@${message.author.id}> successfully robbed <@${targetUser.id}> and gained **${amount.toLocaleString()}** 🪙!`
                : `<@${message.author.id}> tried to rob <@${targetUser.id}> but failed and lost **${amount.toLocaleString()}** 🪙!`)
            .addFields(
                { name: `${message.author.username}'s New Balance`, value: `${getBalance(message.author.id).toLocaleString()} 🪙`, inline: true },
                { name: `${targetUser.username}'s New Balance`, value: `${getBalance(targetUser.id).toLocaleString()} 🪙`, inline: true }
            )
            .setFooter({ text: 'GamblingBOT®' });

        message.channel.send({ embeds: [embed] });
    },
};
