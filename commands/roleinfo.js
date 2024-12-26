const { EmbedBuilder } = require('discord.js');

module.exports = {
    names: ['roleinfo'],
    description: 'Displays information about server roles.',
    async execute(message) {
        const roleInfo = [
            { name: 'Bronze', id: '1319351132337733713', range: '0 - 100' },
            { name: 'Silver', id: '1319351242660646955', range: '101 - 500' },
            { name: 'Gold', id: '1319351386248577056', range: '501 - 1000' },
            { name: 'Emerald', id: '1319351508319473736', range: '1001 - 2000' },
            { name: 'Diamond', id: '1319390068678463609', range: '2001 - 5000' },
            { name: 'GodTier', id: '1319393154344026193', range: '5001 - 15000' },
            { name: 'Insanity', id: '1321144463849951404', range: '15001 - 25000' },
            { name: 'Otherworldly', id: '1321146589653373000', range: '25000+' },
        ];

        let roleDescriptions = '';
        roleInfo.forEach(role => {
            const roleObject = message.guild.roles.cache.get(role.id); // Get role object from cache
            const roleMention = roleObject ? roleObject.toString() : `<@&${role.id}>`; // Use mention
            roleDescriptions += `${roleMention} - Level Range: **${role.range}**\n`;
        });

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('📋 Role Information')
            .setDescription('Here is a breakdown of the server roles and their level ranges.\n\n' + roleDescriptions)
            .setFooter({ text: 'GamblingBOT®' });
        message.channel.send({ embeds: [embed] });
    },
};
