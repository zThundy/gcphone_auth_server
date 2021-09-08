const config = require('../config.json');
const Utils = require('../utils.js');
const utils = new Utils();
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription("Mostra l'aiuto per i comandi"),
    permissions: [
        {
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
                    dmMessages.messages.fetch({ limit: 100 }).then(messages => { messages.forEach(message => { if (message.author.id == client.user.id) { message.delete(); } }) }
                )});
            })
        } else {
            client.users.cache.get(interaction.member.user.id).createDM().then(dmMessages => {
                dmMessages.messages.fetch({ limit: 100 }).then(messages => { messages.forEach(message => { if (message.author.id == client.user.id) { message.delete(); } }) }
            )});
        }
        const fields = [];
        fields.push({ name: "Comando IP", value: "Per utilizzare il comando /ip bisogna trovarsi all'interno della propria stanza della licenza, e poi per eseguirlo basta seguire la descrizione del comando."});
        fields.push({ name: "IP Revocato", value: "Se uno degli IP presenti nella stanza della tua licenza risulta come \"REVOCATO\" non sarà possibile utilizzarlo o modificarlo!"});
        interaction.member.send({ embeds: [utils.getEmbedMessage({ colorHex: "#c91212", title: "Aiuto comandi", description: "Commands tutorial for dummies!", timestamp: true, thumbnail: "https://cdn.discordapp.com/attachments/562730044108308500/881251835950796930/wikihow_logo.gif", fields: fields })] });
        await interaction.reply({ embeds: [utils.getEmbedMessage({ colorHex: "#18aecc", title: "Aiuto comandi", description: "Aiuto in arrivo!", timestamp: true, thumbnail: "https://cdn.discordapp.com/attachments/858349668197859378/881258714785538088/discord-emojis-black-kid-running.gif" })], ephemeral: true });
    },
};