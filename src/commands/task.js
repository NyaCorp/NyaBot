const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ActionIds, StatusLabels } = require('../utils/constants');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('task')
        .setDescription('Create a new item for the task list')
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The task description')
                .setRequired(true)
        ),

    async execute(interaction) {
        const taskDescription = interaction.options.getString('description');
        const initialContent = `${StatusLabels.NOT_STARTED} ${taskDescription}`;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(ActionIds.NOT_STARTED)
                    .setLabel('Not Started')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(ActionIds.IN_PROGRESS)
                    .setLabel('In Progress')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(ActionIds.DONE)
                    .setLabel('Done')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(ActionIds.HOLD_OFF)
                    .setLabel('Hold Off')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({
            content: initialContent,
            components: [row]
        });
    },
};