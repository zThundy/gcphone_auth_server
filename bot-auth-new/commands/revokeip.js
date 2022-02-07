const config = require('../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const LangManager = require('../classes/LangManager');
const language = new LangManager("commands");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(language.getString("REVOKEIP_NAME"))
        .setDescription(language.getString("REVOKEIP_DESCRIPTION"))
        .addStringOption(option =>
            option.setName('id')
                .setDescription(language.getString("REVOKEIP_DESCRIPTION_ARG_1"))
                .setRequired(true)
                .addChoice('Primo IP', 'firstIP')
                .addChoice('Secondo IP', 'secondIP'))
        .addUserOption(option =>
            option.setName('utente')
                .setDescription(language.getString("REVOKEIP_DESCRIPTION_ARG_2"))
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
                content: language.getString("REVOKEIP_ERROR_1"),
                ephemeral: true
            });
        } else {
            if (room.getSettings().getValue(options[0].value).ip == "REVOCATO") {
                await interaction.reply({
                    content: language.getString("REVOKEIP_ERROR_2"),
                    ephemeral: true
                });
                return;
            }
            room.getSettings().setValue(options[0].value, {
                name: "REVOCATO",
                ip: "REVOCATO"
            })
            room.saveSettings();
            data.eventEmitter.emit("onIPUpdate");
            await interaction.reply({
                content: language.getString("REVOKEIP_SUCCESS_1"),
                ephemeral: true
            });
        }
    },
};