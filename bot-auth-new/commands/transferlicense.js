const config = require('../config.json');
const Utils = require('../utils.js');
const utils = new Utils();
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transferlicense')
		.setDescription("Serve a passare la proprietà di una licenza")
        .addUserOption(option =>
            option.setName('proprietario')
            .setDescription('Da quale utente bisogna prelevare la proprietà della licenza')
            .setRequired(true))
        .addUserOption(option =>
            option.setName('nuovoproprietario')
            .setDescription('A quale utente va assegnata la proprietà della licenza')
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
        var room = data.roomManager.getRoomByUserId(options[0].value);
        if (room == undefined) {
            await interaction.reply({content: "L'utente non possiede una stanza per le licenze!", ephemeral: true});
        } else { 
            room = data.roomManager.getRoomByUserId(options[1].value);
            if (room != undefined) { await interaction.reply({content: "Il nuovo proprietario possiede già una licenza!", ephemeral: true}); return; }
            data.roomManager.transferLicense(options[0].value, options[1].value);
            await interaction.reply({content: "Licenza trasferita", ephemeral: true});
        }
	},
};