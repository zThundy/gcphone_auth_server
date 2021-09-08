const config = require('../config.json');
const Utils = require('../utils.js');
const utils = new Utils();
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('grantip')
		.setDescription("Serve a permettere l'utilizzo di un'IP")
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Di quale IP bisogna permettere l\'utilizzo')
                .setRequired(true)
                .addChoice('Primo IP', 'firstIP')
                .addChoice('Secondo IP', 'secondIP'))
        .addUserOption(option =>
            option.setName('utente')
            .setDescription('Per quale utente bisogna permettere l\'utilizzo di un IP')
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
            if (room.getSettings().getValue(options[0].value).ip != "REVOCATO" && room.getSettings().getValue(options[0].value).ip != "Non acquistato") { await interaction.reply({content: "Questo IP non è stato disabilitato!", ephemeral: true}); return; }
            room.getSettings().setValue(options[0].value, { name: "Senza nome", ip: "Non impostato" })
            room.saveSettings();
            await interaction.reply({content: "Concesso il permesso di utilizzo dell'" + options[0].name, ephemeral: true});
        }
	},
};