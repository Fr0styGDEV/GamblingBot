const { getBalance, updateBalance } = require('../utils/balance');
const { getPlayerLevel, setPlayerLevel, calculateLevelRefund } = require('../utils/levels');
const { assignRole } = require('../utils/roles');
const { EmbedBuilder } = require('discord.js');
const { updateNick } = require('../utils/nickname');

module.exports = {
    names: ['selllevel'],
    description: 'sell specifed amount of levels for coins `!levelup 3`.',
    async execute(message, args) {
        const userId = message.author.id;
        const currentBalance = getBalance(userId);
        const currentLevel = getPlayerLevel(userId);
        const levelsToSell = parseInt(args[0], 10) || 1;

        if (levelsToSell > currentLevel) {
            return message.reply(`You do not have enough levels to sell. Your current level is ${currentLevel}`);
        }
        if (levelsToSell < 0) {
            return message.reply(`You think im stupid?`);
        }
        const refundAmount = calculateLevelRefund(currentLevel, levelsToSell, baseCost = 1000, scaleFactor = 1.05, refundRate = 1);
        updateBalance(userId, currentBalance + refundAmount);
        const newBalance = getBalance(userId);
        const newLevel = currentLevel - levelsToSell;
        setPlayerLevel(userId, newLevel);
        try { updateNick(message.member, newLevel, message.member.user.username, userId);
        
        await assignRole(message.member, newLevel, message.guild);
        const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('📈 💸 Level Sale 💰')
        .setDescription(`<@${message.author.id}>, You sold **${levelsToSell} levels** for ${refundAmount.toLocaleString()} 🪙`)
        .addFields({ name: 'New Balance:', value: `${newBalance.toLocaleString()} 🪙.` })
        .setFooter({ text: 'GamblingBOT®' });

        message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error('Failed to update nickname or assign role:', err);
            message.reply(
                `You sold ${levelsToSell} levels for ${refundAmount.toLocaleString()}. Your new balance is ${newBalance.toLocaleString()} 🪙, but I couldn't update your nickname or roles due to permission issues.`
            );
        }
    }

    
    
    
    
    
    
    
    
    
    }