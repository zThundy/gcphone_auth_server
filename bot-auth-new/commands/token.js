const config = require('../config.json');
const { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('token')
		.setDescription("Per i comandi da admin")
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('generate')
            .setDescription('Serve a generare un token per la creazione di una stanza, scadrà dopo 30 minuti!')
            .addUserOption(option =>
                option.setName('utente')
                .setDescription('Per quale utente bisogna creare il token')
                .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('revoke')
            .setDescription('Serve a disattivare un token per prevenire la creazione di una stanza')
            .addStringOption(option =>
                option.setName('token')
                    .setDescription('Il token da disattivare')
                    .setRequired(true))),
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
	async execute(interaction, data) {
        var option = interaction.options._hoistedOptions[0];
        if (interaction.options._subcommand == "generate") {
            if (data.roomManager.getRoomByUserId(option.value) != undefined) {
                await interaction.reply({content: "Impossibile generare un token, l'utente possiede già una stanza personale!", ephemeral: true});
            } else {
                await interaction.reply({content: "Generato token " + data.tokenManager.registerToken(option.value) + " per " + (option.member.nickname || option.user.username), ephemeral: true});
            }
        } else if (interaction.options._subcommand == "revoke") {
            if (data.tokenManager.revokeToken(option.value)) {
                await interaction.reply({content: "Revocato il token " + option.value, ephemeral: true});
            } else {
                await interaction.reply({content: "Impossibile revocare il token " + option.value, ephemeral: true});
            }
        }
	},
};


