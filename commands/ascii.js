const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Jimp = require('jimp');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    names: ['ascii'],
    description: 'Converts an image to ASCII art and displays it as an image.',
    async execute(message) {
        // Check if the user attached an image
        if (!message.attachments.size) {
            return message.reply('Please attach an image to convert to ASCII art.');
        }

        // Get the first attachment (assuming it's an image)
        const imageUrl = message.attachments.first().url;

        try {
            // Load the image using Jimp
            const image = await Jimp.read(imageUrl);

            // Increase resolution with higher dimensions
            const maxWidth = 150; // Increased width for better detail
            const aspectRatio = image.bitmap.width / image.bitmap.height;
            const newWidth = maxWidth;
            const newHeight = Math.round(maxWidth / aspectRatio / 1.8); // Adjust height for text aspect ratio

            // Resize and convert the image to grayscale
            image.resize(newWidth, newHeight).greyscale();

            // Define reversed ASCII characters (lighter to darker)
            const chars = ' .:-=+*#%@';

            let ascii = [];

            // Loop through each pixel and convert to ASCII
            for (let y = 0; y < image.bitmap.height; y++) {
                let line = '';
                for (let x = 0; x < image.bitmap.width; x++) {
                    const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y));
                    const brightness = (r + g + b) / 3;
                    const index = Math.floor((brightness / 255) * (chars.length - 1));
                    line += chars[index];
                }
                ascii.push(line);
            }

            // Render ASCII into an image using Canvas
            const fontSize = 7; 
            const lineHeight = fontSize * 1.2;
            const canvas = createCanvas(image.bitmap.width * fontSize * 0.6, image.bitmap.height * lineHeight);
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'white';
            ctx.font = `${fontSize}px Courier New`;

            ascii.forEach((line, i) => {
                ctx.fillText(line, 0, i * lineHeight);
            });

            // Save the image and send it as an attachment
            const buffer = canvas.toBuffer('image/png');
            const attachment = new AttachmentBuilder(buffer, { name: 'ascii-art.png' });

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🎨 ASCII Art')
                .setImage('attachment://ascii-art.png')
                .setFooter({ text: 'GamblingBOT®' });

            message.channel.send({ embeds: [embed], files: [attachment] });
        } catch (error) {
            console.error('Error processing image:', error);
            message.reply('An error occurred while processing the image. Please try again with a different image.');
        }
    },
};
