const config = require('../config.json');
const Utils = require('../utils.js');
const utils = new Utils();
const { SlashCommandBuilder } = require('@discordjs/builders');
const LangManager = require('../LangManager');
const language = new LangManager("commands");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(language.getString("TRANSFERLICENSE_TITLE"))
        .setDescription(language.getString("TRANSFERLICENSE_DESCRIPTION"))
        .addUserOption(option =>
            option.setName('proprietario')
                .setDescription(language.getString("TRANSFERLICENSE_DESCRIPTION_ARG_1"))
                .setRequired(true))
        .addUserOption(option =>
            option.setName('nuovoproprietario')
                .setDescription(language.getString("TRANSFERLICENSE_DESCRIPTION_ARG_2"))
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
                content: language.getString("TRANSFERLICENSE_ERROR_1"),
                ephemeral: true
            });
        } else {
            room = data.roomManager.getRoomByUserId(options[1].value);
            if (room != undefined) {
                await interaction.reply({
                    content: language.getString("TRANSFERLICENSE_ERROR_2"),
                    ephemeral: true
                });
                return;
            }
            data.roomManager.transferLicense(options[0].value, options[1].value);
            await interaction.reply({
                content: language.getString("TRANSFERLICENSE_SUCCESS_1"),
                ephemeral: true
            });
        }
    },
};