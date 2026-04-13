const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tasks')
        .setDescription('Create multiple tasks'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('multiple_tasks_modal')
            .setTitle('Task Creation');

        const tasksInput = new TextInputBuilder()
            .setCustomId('tasks_input')
            .setLabel('Enter tasks (one per line)')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Update dependencies\nReview database\nDeploy to production')
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(tasksInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
    },
};