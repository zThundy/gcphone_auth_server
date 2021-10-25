const config = require('../config.json');
const Utils = require('../utils.js');
const utils = new Utils();
const { SlashCommandBuilder } = require('@discordjs/builders');
const LangManager = require('../LangManager');
const language = new LangManager("commands");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(language.getString("HELP_NAME"))
        .setDescription(language.getString("HELP_DESCRIPTION")),
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
    spamDelay: 86400,
    async execute(interaction, client) {
        if (client.users.cache.get(interaction.member.user.id) == null) {
            client.users.fetch(interaction.member.user.id).then(user => {
                user.createDM().then(dmMessages => {
                    dmMessages.messages.fetch({ limit: 100 }).then(messages => {
                        messages.forEach(message => {
                            if (message.author.id == client.user.id) {
                                message.delete();
                            }
                        })
                    })
                });
            })
        } else {
            client.users.cache.get(interaction.member.user.id).createDM().then(dmMessages => {
                dmMessages.messages.fetch({ limit: 100 }).then(messages => {
                    messages.forEach(message => {
                        if (message.author.id == client.user.id) {
                            message.delete();
                        }
                    })
                })
            });
        }
        const fields = [];
        fields.push({
            name: language.getString("HELP_FIELDS_TITLE_1"),
            value: language.getString("HELP_FIELDS_DESCRIPTION_1")
        });
        fields.push({
            name: language.getString("HELP_FIELDS_TITLE_2"),
            value: language.getString("HELP_FIELDS_DESCRIPTION_2")
        });
        fields.push({
            name: language.getString("HELP_FIELDS_TITLE_3"),
            value: language.getString("HELP_FIELDS_DESCRIPTION_3")
        });
        interaction.member.send({
            embeds: [utils.getEmbedMessage({
                colorHex: "#c91212",
                title: language.getString("HELP_EMBED_TITLE_PRIVATE"),
                description: language.getString("HELP_EMBED_DESCRIPTION_PRIVATE"),
                timestamp: true,
                thumbnail: language.getString("HELP_EMBED_THUBNAIL_PRIVATE"),
                fields: fields
            })]
        });
        await interaction.reply({
            embeds: [utils.getEmbedMessage({
                colorHex: "#18aecc",
                title: language.getString("HELP_EMBED_TITLE_PUBLIC"),
                description: language.getString("HELP_EMBED_DESCRIPTION_PUBLIC"),
                timestamp: true,
                thumbnail: language.getString("HELP_EMBED_THUBNAIL_PUBLIC")
            })],
            ephemeral: true
        });
    },
};