const discord = require("discord.js");
const config = require("../config");
const utils = require("../utils");

const { MessageButton, MessageActionRow } = require("discord-buttons");

exports.onPrivateMessage = (message, channel, guild, extradata) => {
    // extradata.conn.query(`SELECT * FROM ips WHERE `)
   
    const embed = new discord.MessageEmbed()
        .setColor('#3E8868')
        .setTitle("Here's a list of your ips")
        .setTimestamp()
        .setFooter('Made with ❤️ by zThundy__')

    let ip_management_button = new MessageButton()
        .setLabel("IP Management")
        .setID("ip_management")
        .setStyle("grey");

    let regenerate_licenses_button = new MessageButton()
        .setLabel("Regenerate Licenses")
        .setID("regen_licenses")
        .setStyle("green");

    let row = new MessageActionRow()
        .addComponents(ip_management_button, regenerate_licenses_button);

    channel.send(embed, row);
}

exports.definedButtons = ["ip_management", "regen_licenses"];

exports.onbuttonClick = (button, message, channel, conn) => {
}