const config = require('../config.json');
const Utils = require('../utils.js');
const utils = new Utils();
const { SlashCommandBuilder } = require('@discordjs/builders');
const LangManager = require('../classes/LangManager');
const language = new LangManager("commands");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(language.getString("IP_NAME"))
        .setDescription(language.getString("IP_DESCRIPTION"))
        .addStringOption(option =>
            option.setName('id')
                .setDescription(language.getString("IP_DESCRIPTION_ARG_1"))
                .setRequired(true)
                .addChoice('Primo IP', 'firstIP')
                .addChoice('Secondo IP', 'secondIP'))
        .addStringOption(option =>
            option.setName('nome')
                .setDescription(language.getString("IP_DESCRIPTION_ARG_2"))
                .setRequired(true))
        .addStringOption(option =>
            option.setName('ip')
                .setDescription(language.getString("IP_DESCRIPTION_ARG_3"))
                .setRequired(true)),
    permissions: [{
            id: config.roles.everyone,
            type: 'ROLE',
            permission: false
        },
        {
            id: config.roles.customer,
            type: 'ROLE',
            permission: true
        },
        {
            id: config.roles.admin,
            type: 'ROLE',
            permission: true
        }
    ],
    spamDelay: 43200,
    async execute(interaction, data) {
        var room = data.room;
        var eventEmitter = data.eventEmitter;
        var roomChannels = data.roomChannels;
        if (!roomChannels.includes(interaction.channelId)) {
            await interaction.reply({
                content: data.mLanguage.getString("CANT_USE_COMMAND_HERE"),
                ephemeral: true
            });
            return;
        }
        if (utils.validateIPaddress(interaction.options._hoistedOptions[2].value)) {
            if (room.getSettings().getValue(interaction.options._hoistedOptions[0].value).ip == "REVOCATO") {
                await interaction.reply({
                    content: language.getString("IP_ERROR_1"),
                    ephemeral: true
                });
                return;
            }
            if (room.getSettings().getValue(interaction.options._hoistedOptions[0].value).ip == "Non acquistato") {
                await interaction.reply({
                    content: language.getString("IP_ERROR_2"),
                    ephemeral: true
                });
                return;
            }
            room.getSettings().setValue(interaction.options._hoistedOptions[0].value, {
                name: interaction.options._hoistedOptions[1].value,
                ip: interaction.options._hoistedOptions[2].value
            })
            room.saveSettings();
            eventEmitter.emit('onIPUpdate');
            await interaction.reply({
                content: language.getString("IP_SUCCESS_1"),
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: language.getString("IP_ERROR_3"),
                ephemeral: true
            });
        }
    },
};