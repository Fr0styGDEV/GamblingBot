const { PermissionsBitField } = require('discord.js');

module.exports = {
    names: ['clear', 'purge'],
    description: 'Clears a specified number of messages from the chat.',
    async execute(message, args) {
        const allowedUserId = '783036885299626015'; // Replace with your User ID
        const amount = parseInt(args[0]);

        // Permission check - only the specified user can run this command
        if (message.author.id !== allowedUserId) {
            return message.reply('❌ You do not have permission to use this command.');
        }

        // Validate amount input
        if (isNaN(amount) || amount <= 0 || amount > 100) {
            return message.reply('Please specify a valid number of messages to delete (1-100).');
        }

        // Check for Manage Messages permission
        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('❌ I do not have permission to delete messages.');
        }

        try {
            // Delete the specified number of messages
            const deleteAmount = amount + 1;
            const deletedMessages = await message.channel.bulkDelete(deleteAmount, true); // "true" skips older messages (14+ days)
            message.channel.send(`🧹 Deleted **${amount}** messages.`)
                .then(msg => setTimeout(() => msg.delete(), 5000)); // Auto-delete confirmation message
        } catch (error) {
            console.error('Error clearing messages:', error);
            message.reply('❌ Failed to delete messages. Make sure the messages are not older than 14 days.');
        }
    },
};
