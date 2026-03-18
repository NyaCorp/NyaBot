const { Events, ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
        else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'multiple_tasks_modal') {
                const rawTasks = interaction.fields.getTextInputValue('tasks_input');
                
                const taskList = rawTasks
                    .split('\n')
                    .map(task => task.trim())
                    .filter(task => task.length > 0);

                if (taskList.length === 0) {
                    return interaction.reply({ content: 'No valid tasks were provided.', ephemeral: true });
                }

                if (taskList.length > 25) {
                    return interaction.reply({ content: 'The maximum limit is 25 tasks per list.', ephemeral: true });
                }

                const content = taskList.map(task => `${StatusLabels.NOT_STARTED} ${task}`).join('\n');

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('task_select_menu')
                    .setPlaceholder('Select a task to change its status');

                taskList.forEach((task, index) => {
                    selectMenu.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(task.substring(0, 100))
                            .setValue(index.toString())
                    );
                });

                const row = new ActionRowBuilder().addComponents(selectMenu);

                await interaction.reply({ content: content, components: [row] });
            }
        }
        else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'task_select_menu') {
                const selectedIndex = interaction.values[0];

                const buttonsRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`update_task|${selectedIndex}|NOT_STARTED`)
                        .setLabel('Not Started')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`update_task|${selectedIndex}|IN_PROGRESS`)
                        .setLabel('In Progress')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(`update_task|${selectedIndex}|DONE`)
                        .setLabel('Done')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`update_task|${selectedIndex}|HOLD_OFF`)
                        .setLabel('Hold Off')
                        .setStyle(ButtonStyle.Danger)
                );

                const selectRow = ActionRowBuilder.from(interaction.message.components[0]);

                await interaction.update({ components: [selectRow, buttonsRow] });
            }
        }
        else if (interaction.isButton()) {
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
            if (interaction.customId.startsWith('update_task|')) {
                const parts = interaction.customId.split('|');
                const taskIndex = parseInt(parts[1], 10);
                const statusKey = parts[2];

                const newStatus = StatusLabels[statusKey];
                const lines = interaction.message.content.split('\n');

                if (taskIndex >= 0 && taskIndex < lines.length) {
                    let line = lines[taskIndex];

                    for (const label of Object.values(StatusLabels)) {
                        if (line.startsWith(label)) {
                            line = line.replace(label, '').trim();
                            break;
                        }
                    }

                    lines[taskIndex] = `${newStatus} ${line}`;
                }

                const selectRow = ActionRowBuilder.from(interaction.message.components[0]);
                
                await interaction.update({ 
                    content: lines.join('\n'), 
                    components: [selectRow] 
                });
            } else {
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
                    case ActionIds.NOT_STARTED: newStatus = StatusLabels.NOT_STARTED; break;
                    case ActionIds.IN_PROGRESS: newStatus = StatusLabels.IN_PROGRESS; break;
                    case ActionIds.DONE: newStatus = StatusLabels.DONE; break;
                    case ActionIds.HOLD_OFF: newStatus = StatusLabels.HOLD_OFF; break;
                    default: return;
                }

                try {
                    await interaction.update({ content: `${newStatus} ${taskDescription}` });
                } catch (error) {
                    console.error('Error processing component update:', error);
                }
            }
        }
    },
};