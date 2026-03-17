const { Events, ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { ActionIds, StatusLabels } = require('../utils/constants');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`Registered command not found: ${interaction.commandName}`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing command ${interaction.commandName}:`, error);

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'An internal error occurred while executing this command.', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'An internal error occurred while executing this command.', ephemeral: true });
                }
            }
        }
        else if (interaction.isButton()) {

            // ========= NEW TASK MODAL ========= //
            if (interaction.customId === ActionIds.NEW_TASK) {
                const modal = new ModalBuilder().setCustomId('myModal').setTitle('My Modal');
                const hobbiesInput = new TextInputBuilder()
                    .setCustomId('hobbiesInput')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('card games, films, books, etc.');

                const hobbiesLabel = new LabelBuilder()
                    .setLabel("What's some of your favorite hobbies?")
                    .setDescription('Activities you like to participate in')
                    .setTextInputComponent(hobbiesInput);

                modal.addLabelComponents(hobbiesLabel);
                return await interaction.showModal(modal);
            }

            // ========= CHANGE THE TASK STATUS ========= //
            const currentContent = interaction.message.content;

            let taskDescription = currentContent;
            let currentStatusFound = false;

            for (const label of Object.values(StatusLabels)) {
                if (currentContent.startsWith(label)) {

                    taskDescription = currentContent.replace(label, '').trim();
                    currentStatusFound = true;
                    break;
                }
            }

            if (!currentStatusFound) {
                await interaction.reply({
                    content: 'The message is not in the expected format for updating.',
                    ephemeral: true
                });
                return;
            }


            let newStatus = '';

            switch (interaction.customId) {
                case ActionIds.NOT_STARTED:
                    newStatus = StatusLabels.NOT_STARTED;
                    break;
                case ActionIds.IN_PROGRESS:
                    newStatus = StatusLabels.IN_PROGRESS;
                    break;
                case ActionIds.DONE:
                    newStatus = StatusLabels.DONE;
                    break;
                case ActionIds.HOLD_OFF:
                    newStatus = StatusLabels.HOLD_OFF;
                    break;
                default:
                    return;
            }

            try {
                await interaction.update({
                    content: `${newStatus} ${taskDescription}`
                });
            } catch (error) {
                console.error('Error processing component update:', error);
            }
        }
    },
};
