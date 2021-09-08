const config = require('../config.json');
const Utils = require('../utils.js');
const utils = new Utils();
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('revokeip')
        .setDescription("Serve a revocare l'utilizzo di un'IP")
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Quale IP bisogna revocare')
                .setRequired(true)
                .addChoice('Primo IP', 'firstIP')
                .addChoice('Secondo IP', 'secondIP'))
        .addUserOption(option =>
            option.setName('utente')
            .setDescription('Per quale utente bisogna revocare un IP')
            .setRequired(true)),
    permissions: [
        {
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
            await interaction.reply({content: "L'utente non possiede una stanza per le licenze!", ephemeral: true});
        } else {
            if (room.getSettings().getValue(options[0].value).ip == "REVOCATO") { await interaction.reply({content: "Questo IP è già stato disabilitato!", ephemeral: true}); return; }
            room.getSettings().setValue(options[0].value, { name: "REVOCATO", ip: "REVOCATO" })
            room.saveSettings();
            data.eventEmitter.emit("onIPUpdate");
            await interaction.reply({content: "IP revocato", ephemeral: true});
        }
	},
};