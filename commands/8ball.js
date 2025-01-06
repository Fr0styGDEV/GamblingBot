const { EmbedBuilder } = require('discord.js');

module.exports = {
    names: ['8ball'],
    description: 'Ask the magic 8-ball a question for a yes or no answer.',
    execute(message, args) {
        if (args.length === 0) {
            return message.reply('You need to ask a question! Example: `!8ball Will I win today?`');
        }


        const userInput = args.join(' ');
        const question = userInput[0].toUpperCase() + userInput.slice(1);
        const user = message.member.user.username;

        const responses = [
            'Yes', 'No', 'Maybe', 'Absolutely', 'Definitely not', 
            'Ask again later', 'Cannot predict now', 'Most likely', 'Very doubtful',
            'Outlook good', 'My sources say no', 'Signs point to yes'
        ];

        let response = responses[Math.floor(Math.random() * responses.length)];
        const positiveResponses = [
            'Yes', 'Absolutely', 'Most likely', 'Outlook good', 'Signs point to yes','Maybe'
        ];

        /// check if the question is about nolan
        const nolan = '799382476102565929';
        if (question.includes('gay') && question.includes('nolan') || question.includes(nolan) ) {  
            response = 'Yes';
        }
        // if (question.includes('straight') && question.includes('nolan') || question.includes(nolan) ) {
        //     response = 'No';
        // }
        ///

        const embed = new EmbedBuilder()
            .setColor(positiveResponses.includes(response) ? '#00ff00' : '#ff0000') // Green for positive, red for others
            .setTitle('🎱 Magic 8-Ball')
            .setDescription(`**${user} asks:** ${question}?`)
            .addFields({ name: 'Response:', value: `${response}` })
            .setFooter({ text: 'GamblingBOT®' });

        message.channel.send({ embeds: [embed] });
    },
};
