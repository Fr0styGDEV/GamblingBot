module.exports = {
    names: ['ping'],
    description: 'Replies with Pong!',
    execute(message) {
        message.channel.send('Pong!');
    },
};
