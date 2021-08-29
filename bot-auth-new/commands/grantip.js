const config = require('../config.json');
const Utils = require('../utils.js');
const utils = new Utils();
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('grantip')
		.setDescription("Serve a abilitare l'utilizzo di un'IP")
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Quale ip bisogna abilitare')
                .setRequired(true)
                .addChoice('Primo IP', 'firstIP')
                .addChoice('Secondo IP', 'secondIP'))
        .addUserOption(option =>
            option.setName('utente')
            .setDescription('Per quale utente bisogna abilitare un IP')
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
            if (room.getSettings().getValue(options[0].value).ip != "REVOCATO") { await interaction.reply({content: "Questo IP non è stato disabilitato!", ephemeral: true}); return; }
            room.getSettings().setValue(options[0].value, { name: "Senza nome", ip: "Non impostato" })
            room.saveSettings();
            data.eventEmitter.emit("onIPUpdate");
            await interaction.reply({content: "IP abilitato", ephemeral: true});
        }
	},
};