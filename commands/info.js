const { EmbedBuilder } = require('discord.js');

module.exports = {
    names: ['info', 'commands'],
    description: 'Display all available commands and their descriptions.',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('GamblingBOT® Commands')
            .setDescription('Here are all the available commands you can use:')
            .addFields(
                { name: '!bal / !b', value: 'Check your current coin balance.', inline: true },
                { name: '!gamble <amount> / !g <amount>', value: 'Gamble a certain amount of coins (50/50 chance).', inline: true },
                { name: '!rob @user <amount> / !r @user <amount>', value: 'Attempt to rob coins from another player (50/50 chance).', inline: true },
                { name: '!give @user <amount>', value: 'Give coins to another player.', inline: true },
                { name: '!jackpot <amount> <odds>/ !jp <amount> <odds>', value: 'You set your reward multiplier, but beware—its also your odds!', inline: true },
                { name: '!leaderboard / !lb', value: 'View the top 5 players by coin balance and levels.', inline: true },
                { name: '!frostycoin / !fc', value: 'View the current price and history of FrostyCoin®💎 (updates every minute)', inline: true },
                { name: '!buy', value: 'Purchase FrostyCoin®💎 at the current market value.', inline: true },
                { name: '!sell', value: 'Sell your FrostyCoin®💎 at the current market value.', inline: true },
                { name: '!earn', value: 'Answer gaming related trivia questions for coins!', inline: true },
                { name: '!levelup <levels>', value: 'Spend coins to level up and increase your rank.', inline: true },
                { name: '!selllevel <levels>', value: 'Sell levels to get coins refunded', inline: true },
                { name: '!info / !commands', value: 'Display this help message with all commands.', inline: true }
            )
            .setFooter({ text: 'GamblingBOT® - Have fun and gamble responsibly! 😉', })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};