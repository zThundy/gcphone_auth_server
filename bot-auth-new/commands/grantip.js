const config = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const LangManager = require('../classes/LangManager');
const language = new LangManager("commands");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(language.getString("GRANTIP_NAME"))
        .setDescription(language.getString("GRANTIP_DESCRIPTION"))
        .addStringOption(option =>
            option.setName('id')
                .setDescription(language.getString("GRANTIP_DESCRIPTION_ARG_1"))
                .setRequired(true)
                .addChoice('Primo IP', 'firstIP')
                .addChoice('Secondo IP', 'secondIP'))
        .addUserOption(option =>
            option.setName('utente')
                .setDescription(language.getString("GRANTIP_DESCRIPTION_ARG_2"))
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
        var room = data.roomManager.getRoomByUserId(options[1].value);
        if (room == undefined) {
            await interaction.reply({
                content: language.getString("GRANTIP_ERROR_1"),
                ephemeral: true
            });
        } else {
            if (room.getSettings().getValue(options[0].value).ip != "REVOCATO" && room.getSettings().getValue(options[0].value).ip != "Non acquistato") {
                await interaction.reply({
                    content: language.getString("GRANTIP_ERROR_2"),
                    ephemeral: true
                });
                return;
            }
            room.getSettings().setValue(options[0].value, {
                name: "Senza nome",
                ip: "Non impostato"
            })
            room.saveSettings();
            await interaction.reply({
                content: language.getString("GRANTIP_SUCCESS_1", options[0].name),
                ephemeral: true
            });
        }
    },
};