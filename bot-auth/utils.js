module.exports.yesEmbed = (message) => {
    const embed = new discord.MessageEmbed()
        .setColor('#3E8868')
        .setTitle(message)
        .setTimestamp()
        .setFooter('Made with ❤️ by zThundy__')
    return embed;
}

module.exports.noEmbed = (message) => {
    const embed = new discord.MessageEmbed()
        .setColor('#883F3F')
        .setTitle(message)
        .setTimestamp()
        .setFooter('Made with ❤️ by zThundy__')
    return embed;
}

module.exports.createLicense = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) { result += characters.charAt(Math.floor(Math.random() * charactersLength)); }
    return result;
}