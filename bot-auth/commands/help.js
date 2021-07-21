const discord = require("discord.js");
const config = require("../config");

const messageListener = (message, channel, guild, extradata) => {
    var fields = [{name: "⚙️ " + config.bot_info.command_prefix + 'help', value: 'Shows the command you can perform, depending on where you are executing it'}]
    const embed = new discord.MessageEmbed()
        .setColor('#3E8868')
        .setTimestamp()
        .setFooter('Made with ❤️ by zThundy__')
    if (guild) {
        fields.push({name: "⚙️ " + config.bot_info.command_prefix + 'checkme', value: 'This command check if you\'re a customer or not'});
        embed.setTitle("Public commands list")
    } else {
        fields.push({name: "⚙️ " + config.bot_info.command_prefix + 'licenses', value: 'This command shows your currently active liceses'});
        embed.setTitle("Private commands list")
    }
    fields = [...fields, {name: "❓ Informations", value: "Open my dm's for more personal commands"}];
    embed.addFields(fields);
    channel.send(embed);
}

exports.onMessage = messageListener;
exports.onPrivateMessage = messageListener;
