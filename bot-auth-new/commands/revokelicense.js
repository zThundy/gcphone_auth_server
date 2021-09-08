const config = require('../config.json');
const Utils = require('../utils.js');
const utils = new Utils();
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('revokelicense')
        .setDescription("Serve a revocare una licenza")
        .addUserOption(option =>
            option.setName('utente')
            .setDescription('A quale utente bisogna revocare la licenza')
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
            data.roomManager.revokeLicense(options[0].value);
            data.eventEmitter.emit("onIPUpdate");
            await interaction.reply({content: "Licenza revocata", ephemeral: true});
        }
	},
};