const config = require('../config.json');
const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('activate')
		.setDescription("Comando per l'attivazione dei token")
        .addStringOption(option =>
            option.setName('token')
            .setDescription('Inserisci il token da attivare')
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
    spamDelay: 120,
	async execute(interaction, tokenManager) {
        var option = interaction.options._hoistedOptions[0];
        if (tokenManager.activateToken(interaction.member.user.id, option.value)) {
            await interaction.reply({content: "Attivato il token " + option.value, ephemeral: true});
        } else {
            interaction.reply({content: "Impossibile attivare il token " + option.value, ephemeral: true});
        }
	},
};


