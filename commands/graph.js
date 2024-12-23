const { EmbedBuilder } = require('discord.js');
const { readPriceHistory, readCoinPrice } = require('../utils/coinPrice');  // Import the function to read the current coin price
const fs = require('fs');
const path = require('path');

module.exports = {
    names: ['FrostyCoin', 'fc'],
    description: 'Display a simple stock-like graph of frostycoin value over time.',
    async execute(message) {
        // Use the price history from coinPrice.js as the dataset
        const values = readPriceHistory();
        const currentValue = readCoinPrice();

        // Limit the history to the last 10 entries
        const maxHistory = 10;
        const recentValues = values.slice(-maxHistory);

        // Get the current coin price
        const currentPrice = parseFloat(readCoinPrice());

        if (isNaN(currentPrice)) {
            return message.reply('The current coin price could not be retrieved.');
        }

        // Read investment data from investments.json
        const investmentsFile = path.join(__dirname, '../storage/investments.json');
        let investments = {};
        try {
            const data = fs.readFileSync(investmentsFile, 'utf-8');
            investments = JSON.parse(data);
        } catch (error) {
            console.error('Error reading investments file:', error);
        }

        // Get the user's investment information
        const userId = message.author.id;
        const userInvestment = investments[userId];
        const amountOwned = userInvestment ? userInvestment.amount : 0;
        const priceAtPurchase = userInvestment ? userInvestment.priceAtPurchase : 0;

        // Normalize the values to fit into a 10-row vertical graph
        const max = Math.max(...recentValues);
        const min = Math.min(...recentValues);
        const height = 10;  // Max rows for the graph

        const scale = (value) => Math.round(((value - min) / (max - min)) * height);

        let graph = '';
        // Create the graph by iterating through each row
        for (let i = height; i >= 1; i--) {
            let row = '';
            for (let j = 0; j < recentValues.length; j++) {
                let color = '🔳 ';  // Default for empty space
                if (scale(recentValues[j]) >= i) {
                    if (j > 0 && recentValues[j] > recentValues[j - 1]) {
                        color = '🟩 ';  // Green for increase
                    } else if (j > 0 && recentValues[j] < recentValues[j - 1]) {
                        color = '🟥 ';  // Red for decrease
                    } else {
                        color = '🟧 ';  // Orange for no change
                    }
                }
                row += color;
            }
            graph += `${row}\n`;  // Add each row of the graph
        }

        // Add axis labels (only display values for the bottom row)
        let axis = '';
        recentValues.forEach(value => {
            axis += `${value.toString().padStart(4, ' ')} `;  // Align the numbers
        });

        // Display user's investment info (amount owned and price at purchase)
        const investmentInfo = amountOwned > 0
            ? `<@${message.author.id}>, you own ${amountOwned.toLocaleString()} FrostyCoin(s) bought at ${priceAtPurchase.toFixed(2)} each. Worth ${(amountOwned * currentValue).toLocaleString()} 🪙 at current FrostyCoin®💎 Value`
            : `<@${message.author.id}>, you currently don\'t own any FrostyCoin.`;

        // Create the embed with the current coin price in the header
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`🏛️ FrostyCoin®💎 Current Price: ${currentPrice} `) // Add current price in the title
            .setDescription(`\`\`\`${graph}${axis}\`\`\`\n\n${investmentInfo}`)
            .setFooter({ text: 'GamblingBOT®' });

        message.channel.send({ embeds: [embed] });
    },
};
