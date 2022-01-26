const config = require('../config.json');
const { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } = require('@discordjs/builders');
const LangManager = require('../LangManager');
const language = new LangManager("commands");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(language.getString("TOKEN_TITLE"))
        .setDescription(language.getString("TOKEN_DESCRIPTION"))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('generate')
            .setDescription(language.getString("TOKEN_DESCRIPTION_ARG_1"))
            .addUserOption(option =>
                option.setName('utente')
                    .setDescription(language.getString("TOKEN_DESCRIPTION_ARG_2"))
                    .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('revoke')
            .setDescription(language.getString("TOKEN_DESCRIPTION_ARG_3"))
            .addStringOption(option =>
                option.setName('token')
                    .setDescription(language.getString("TOKEN_DESCRIPTION_ARG_4"))
                    .setRequired(true))),
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
        var option = interaction.options._hoistedOptions[0];
        switch (interaction.options._subcommand) {
            case "generate":
                if (data.roomManager.getRoomByUserId(option.value) != undefined) {
                    await interaction.reply({
                        content: language.getString("TOKEN_ERROR_1"),
                        ephemeral: true
                    });
                } else {
                    if (data.tokenManager.getTokenByUserId(option.value) != undefined) {
                        await interaction.reply({
                            content: language.getString("TOKEN_ERROR_2"),
                            ephemeral: true
                        });
                    } else {
                        await interaction.reply({
                            // content: language.getString("TOKEN_SUCCESS_1", (option.member.nickname || option.user.username), data.tokenManager.registerToken(option.value)),
                            content: language.getString("TOKEN_SUCCESS_1", data.tokenManager.registerToken(option.value)),
                            ephemeral: true
                        });
                    }
                }
                break;
            
            case "revoke":
                if (data.tokenManager.revokeToken(option.value)) {
                    await interaction.reply({
                        content: language.getString("TOKEN_SUCCESS_2", option.value),
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: language.getString("TOKEN_ERROR_3", option.value),
                        ephemeral: true
                    });
                }
                break;
        }
    },
};