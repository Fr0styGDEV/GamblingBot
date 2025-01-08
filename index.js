const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const { readCoinPrice, updateCoinPrice, readPriceHistory, startPriceUpdates } = require('./utils/coinPrice');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Load commands into a Collection
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Register all aliases (names)
    command.names.forEach(name => {
        client.commands.set(name, command);
    });
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    startPriceUpdates(client);
});

const badWords = require('./utils/badwords');

client.on('messageCreate', (message) => {
    // Ignore bot messages
    if (message.author.bot) return;

    // Check for bad words
    const content = message.content.toLowerCase();
    if (badWords.some(word => content.includes(word)) && message.author.id != '783036885299626015') {
        message.delete();
        return message.channel.send(`<@${message.author.id}>, please watch your language! Your message was deleted`);
    }

    // Check for commands
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Check if the command exists
    const command = client.commands.get(commandName);
    if (!command) 
        return message.reply('Unrecognized command: ' + commandName);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.');
    }
});


client.login(process.env.BOT_TOKEN);
