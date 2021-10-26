const config = require('../config.json');
const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');
const LangManager = require('../LangManager');
const language = new LangManager("commands");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(language.getString("ACTIVATE_NAME"))
        .setDescription(language.getString("ACTIVATE_DESCRIPTION"))
        .addStringOption(option =>
            option.setName('token')
                .setDescription(language.getString("ACTIVATE_DESCRIPTION_ARG_1"))
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
    spamDelay: 120,
    async execute(interaction, tokenManager) {
        var option = interaction.options._hoistedOptions[0];
        if (tokenManager.activateToken(interaction.member.user.id, option.value)) {
            await interaction.reply({
                content: "Attivato il token " + option.value,
                ephemeral: true
            });
        } else {
            interaction.reply({
                content: "Impossibile attivare il token " + option.value,
                ephemeral: true
            });
        }
    },
};