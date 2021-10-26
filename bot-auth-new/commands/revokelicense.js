const config = require('../config.json');
const Utils = require('../utils.js');
const utils = new Utils();
const { SlashCommandBuilder } = require('@discordjs/builders');
const LangManager = require('../LangManager');
const language = new LangManager("commands");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(language.getString("REVOKELICENSE_TITLE"))
        .setDescription(language.getString("REVOKELICENSE_DESCRIPTION"))
        .addUserOption(option =>
            option.setName('utente')
                .setDescription(language.getString("REVOKELICENSE_DESCRIPTION_ARG_1"))
                .setRequired(true)),
    permissions: [{
            id: config.roles.everyone,
            type: 'ROLE',
            permission: false
        },
        {
            id: config.roles.admin,
            type: 'ROLE',
            permission: true
        }
    ],
    spamDelay: 5,
    async execute(interaction, data) {
        var options = interaction.options._hoistedOptions;
        var room = data.roomManager.getRoomByUserId(options[0].value);
        if (room == undefined) {
            await interaction.reply({
                content: language.getString("REVOKELICENSE_ERROR_1"),
                ephemeral: true
            });
        } else {
            data.roomManager.revokeLicense(options[0].value);
            data.eventEmitter.emit("onIPUpdate");
            await interaction.reply({
                content: language.getString("REVOKELICENSE_SUCCESS_1"),
                ephemeral: true
            });
        }
    },
};