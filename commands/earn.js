const { EmbedBuilder } = require('discord.js');
const { getBalance, updateBalance } = require('../utils/balance');
const { OpenAI } = require('openai');

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// In-memory store for active challenges
const activeChallenges = new Map();

module.exports = {
    names: ['earn'],
    description: 'Earn coins by answering gaming trivia questions!',
    async execute(message, args) {
        const userId = message.author.id;
        const currentBalance = getBalance(userId);

        // Validate the bet amount
        const betAmount = parseInt(args[0], 10);
        if (isNaN(betAmount) || betAmount <= 0) {
            return message.reply('Please specify a valid bet amount (e.g., `!earn 200`).');
        }

        if (betAmount > 1000000) {
            return message.reply('The maximum bet amount for !earn is 🪙 1,000,000. Please enter a lower amount.');
        }

        if (currentBalance < betAmount) {
            return message.reply(`You do not have enough coins to bet 🪙 ${betAmount}. Your current balance is 🪙 ${currentBalance}.`);
        }

        // Step 1: Check if the user already has an active challenge
        if (activeChallenges.has(userId)) {
            return message.reply('You already have an active challenge! Solve it or wait for it to expire.');
        }

        try {
            // Step 2: Generate a gaming trivia question with difficulty scaling
            let difficulty;
            if (betAmount <= 10000) {
                difficulty = 'easy';
            } else if (betAmount <= 500000) {
                difficulty = 'medium';
            } else {
                difficulty = 'hard';
            }

            const prompt = `
            Generate a single multiple-choice gaming trivia question with a ${difficulty} difficulty. The question should be about one of the following games: Minecraft, Rainbow Six Siege, Dead by Daylight, Phasmophobia, CS2, Valorant, or Elden Ring. If none of these games fit, or just to add some diversity, choose another popular game. Ensure the trivia is well-suited to the contestants' knowledge.

            The response must follow this exact format and include only one question:
            Question: [Your trivia question here]
            A: [Option A]
            B: [Option B]
            C: [Option C]
            D: [Option D]
            Correct Answer: [The correct option]
            `;

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            });

            const triviaText = completion.choices[0].message.content.trim();

            // Extract the question and correct answer
            const questionMatch = triviaText.match(/Question: (.+)/);
            const correctAnswerMatch = triviaText.match(/Correct Answer: ([A-D])/i);

            if (!questionMatch || !correctAnswerMatch) {
                throw new Error('Failed to generate a valid trivia question.');
            }

            const question = questionMatch[1];
            const correctAnswer = correctAnswerMatch[1].toUpperCase();

            // Save the trivia for the user
            activeChallenges.set(userId, { question, correctAnswer });

            // Remove the "Correct Answer" line from the trivia text
            const triviaLines = triviaText.split('\n').filter(line => !line.startsWith('Correct Answer:'));
            const filteredTriviaText = triviaLines.join('\n');

            // Deduct the bet amount from the user's balance
            updateBalance(userId, currentBalance - betAmount);

            // Send the trivia question to the user
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`${betAmount} 🪙 Gaming Trivia Challenge!`)
                .setDescription(filteredTriviaText)
                .setFooter({ text: 'Reply with A, B, C, or D to answer!' });

            const triviaMessage = await message.channel.send({ embeds: [embed] });

            // Step 3: Create a message collector to listen for the user's reply
            const filter = (response) => response.author.id === userId;
            const collector = message.channel.createMessageCollector({
                filter,
                time: 30000, // 30 seconds to respond
            });

            collector.on('collect', async (userMessage) => {
                const userAnswer = userMessage.content.trim().toUpperCase();

                // Check if the answer is correct
                if (userAnswer === correctAnswer) {
                    const winnings = betAmount * 2;
                    updateBalance(userId, getBalance(userId) + winnings);
                    message.reply(`🎉 Correct! You earned 🪙 ${winnings}!`);
                } else {
                    message.reply(`❌ Wrong answer. The correct answer was **${correctAnswer}**.`);
                }

                activeChallenges.delete(userId); // Clear the challenge
                collector.stop(); // Stop the collector once the user has replied
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    message.reply('Time is up! You didn\'t reply in time. Please try again.');
                    activeChallenges.delete(userId); // Remove the challenge if they don't respond in time
                }
            });
        } catch (error) {
            console.error('Error generating trivia:', error);
            message.reply('Sorry, I couldn\'t generate a trivia question. Please try again later.');
        }
    },
};
