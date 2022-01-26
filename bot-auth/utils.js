const discord = require("discord.js");

module.exports.yesEmbed = (message, channel) => {
    /**
     * @param {message} message the message you want to visualize as success embed
    */
    const embed = new discord.MessageEmbed()
        .setColor('#3E8868')
        .setTitle(message)
        .setTimestamp()
        .setFooter('Made with ❤️ by zThundy__')
    channel.send(embed).then(msg => {
        setTimeout(() => {
            msg.delete();
        }, 10000);
    });
}

module.exports.noEmbed = (message, channel) => {
    /**
     * @param {message} message the message you want to visualize as errored embed
    */
    const embed = new discord.MessageEmbed()
        .setColor('#883F3F')
        .setTitle(message)
        .setTimestamp()
        .setFooter('Made with ❤️ by zThundy__')
    channel.send(embed).then(msg => {
        setTimeout(() => {
            msg.delete();
        }, 10000);
    });
}

module.exports.createLicense = (length) => {
    /**
     * @param {length} length the length you want your string to be
    */
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) { result += characters.charAt(Math.floor(Math.random() * charactersLength)); }
    return result;
}