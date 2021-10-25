const config = require('../config.json');
const ContextCommandBuilder = require('../ContextCommandBuilder.js');
const LangManager = require('../LangManager');
const language = new LangManager("commands");

module.exports = {
    data: new ContextCommandBuilder(language.getString("ATTIVATOKEN_NAME")),
    async execute(interaction, tokenManager) {
        var option = interaction.options._hoistedOptions[0];
        var token = this.extractToken(option.message.content);
        if (!token) {
            await interaction.reply({
                content: language.getString("ATTIVATOKEN_ERROR_1"),
                ephemeral: true
            });
            return;
        }
        if (tokenManager.activateToken(interaction.member.user.id, token)) {
            await interaction.reply({
                content: language.getString("ATTIVATOKEN_SUCCESS_1", token),
                ephemeral: true
            });
        } else {
            interaction.reply({
                content: language.getString("ATTIVATOKEN_ERROR_2", token),
                ephemeral: true
            });
        }
    },
    extractToken(message) {
        const messageWords = message.split(" ");
        for (var word of messageWords) {
            if (word.match(/.{5}-?.{5}-?.{5}/i)) {
                return word;
            }
        }
    },
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
    ]
};