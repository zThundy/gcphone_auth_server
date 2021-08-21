const config = require('../config.json');
const Utils = require('../utils.js');
const utils = new Utils();
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ip')
		.setDescription("Serve a cambiare uno dei due ip disponibili per l'autenticazione")
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Quale ip bisogna cambiare')
                .setRequired(true)
                .addChoice('Primo IP', 'firstIP')
                .addChoice('Secondo IP', 'secondIP'))
        .addStringOption(option =>
            option.setName('nome')
                .setDescription("Un nome per associarlo all'ip")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('Con quale ip bisogna sostituirlo')
                .setRequired(true)),
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
	async execute(interaction, room, eventEmitter) {
        if (utils.validateIPaddress(interaction.options._hoistedOptions[2].value)) {
            room.getSettings().setValue(interaction.options._hoistedOptions[0].value, { name: interaction.options._hoistedOptions[1].value, ip: interaction.options._hoistedOptions[2].value })
            room.saveSettings();
            eventEmitter.emit('onIPUpdate');
            await interaction.reply({content: "IP cambiato", ephemeral: true});
        } else {
            await interaction.reply({content: "Hai inserito un IP non valido!", ephemeral: true});
        }
	},
};