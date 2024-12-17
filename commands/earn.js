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
    description: 'Earn coins by solving simple coding challenges!',
    async execute(message) {
        const userId = message.author.id;
        const CurrentBalance = getBalance(message.author.id) 

        // Step 1: Check if the user already has an active challenge
        if (activeChallenges.has(userId)) {
            return message.reply('You already have an active challenge! Solve it or wait for it to expire.');
        }

        try {
            // Step 2: Generate a simple coding challenge
            const prompt = `
                Generate a relatively simple Python coding challenge. The problem should be solvable with a short Python function. Provide the problem description and an example input/output. Format your response like this:

                Problem: [problem description]
                Example: [example input/output]
            `;

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            });

            const challengeText = completion.choices[0].message.content.trim();

            if (!challengeText.startsWith('Problem:')) {
                throw new Error('Failed to generate a valid challenge.');
            }

            // Save the challenge for the user
            activeChallenges.set(userId, challengeText);

            // Send the challenge to the user
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('1,000 🪙 2-Minute Coding Challenge!')
                .setDescription(challengeText)
                .setFooter({ text: 'Reply with your solution to complete the challenge!' });

            const challengeMessage = await message.channel.send({ embeds: [embed] });

            // Step 3: Create a message collector to listen for the user's reply
            const filter = (response) => response.author.id === userId;
            const collector = message.channel.createMessageCollector({
                filter,
                time: 120000, // 2 minute to respond
            });

            collector.on('collect', async (userMessage) => {
                const userAnswer = userMessage.content.trim();

                try {
                    // Step 4: Evaluate the user's solution using OpenAI
                    const evalPrompt = `
                        Here is a Python coding challenge:

                        ${challengeText}

                        Here is a user's solution:

                        ${userAnswer}

                        Check the following in the user's solution:
                        1. Is the solution a valid Python function?
                        2. Does the function have the correct syntax, including 'def' keyword and return statements?
                        3. Is the solution logically correct based on the problem description and example provided?
                        4. If there are syntax errors or logical issues, provide a brief explanation of what needs to be fixed.

                        Respond with the first word being "Correct" or "Wrong" and explain why.
                    `;

                    const completion = await openai.chat.completions.create({
                        model: 'gpt-3.5-turbo',
                        messages: [{ role: 'user', content: evalPrompt }],
                    });

                    const evaluation = completion.choices[0].message.content.trim().toLowerCase();

                    // Check the result for correctness and provide more specific feedback
                    if (evaluation.startsWith('correct')) {
                        message.reply('🎉 Correct! You earned 1,000 🪙');
                        updateBalance(message.author.id, CurrentBalance + 1000)
                        activeChallenges.delete(userId); // Clear the challenge
                    } else if (evaluation.startsWith('wrong')) {
                        message.reply(`❌ Wrong answer.\n\nFeedback: ${evaluation}`);
                        activeChallenges.delete(userId);
                    } else {
                        // If neither "Correct" nor "Wrong" is mentioned, provide a fallback message
                        message.reply('Sorry, I couldn\'t properly evaluate your solution.');
                    }

                    collector.stop(); // Stop the collector once the user has replied

                } catch (error) {
                    console.error('Error evaluating solution:', error);
                    message.reply('Sorry, I couldn\'t evaluate your solution. Please try again later.');
                    collector.stop();
                }
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    message.reply('Time is up! You didn\'t reply in time. Please try again.');
                    activeChallenges.delete(userId); // Remove the challenge if they don't respond in time
                }
            });
        } catch (error) {
            console.error('Error generating challenge:', error);
            message.reply('Sorry, I couldn\'t generate a challenge. Please try again later.');
        }
    },
};
