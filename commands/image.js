const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

const BING_API_KEY = process.env.AZURE_KEY;

module.exports = {
    names: ['image', 'img'],
    description: 'Searches Bing and returns a random image result.',
    async execute(message, args) {
        const query = args.join(' ');
        if (!query) {
            return message.reply('Please provide a search term. Example: `!image cat`');
        }

        const endpoint = 'https://api.bing.microsoft.com/v7.0/images/search';

        try {
            const response = await axios.get(endpoint, {
                headers: {
                    'Ocp-Apim-Subscription-Key': BING_API_KEY
                },
                params: {
                    q: query,
                    safeSearch: 'off',
                    count: 10 // Fetch 10 image results
                }
            });

            const images = response.data.value;

            if (!images || images.length === 0) {
                return message.reply('No images found. Try another search term.');
            }

            // Pick a random image
            const randomImage = images[Math.floor(Math.random() * images.length)];

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`🔎 Bing Image Search: "${query}"`)
                .setImage(randomImage.contentUrl)
                .setFooter({ text: 'Powered by Bing Image Search' });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching Bing image:', error);
            message.reply('Failed to fetch images. Please try again later.');
        }
    }
};
