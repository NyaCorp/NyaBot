const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong and displays the current latency of the bot.'),

    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Calculating ...', fetchReply: true });
        
        const latency = sent.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`Pong! Latency is ${latency}ms.`);
    },
};