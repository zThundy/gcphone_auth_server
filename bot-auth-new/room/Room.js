const Discord = require('discord.js');

class Room {
    constructor(data, mySQLManager) {
        this.userId = data.userId;
        this.license = data.license;
        this.settings = data.roomSettings;
        this.channel = data.channel;
        this.language = data.language;
        this.mySQLManager = mySQLManager;

        /*for (var allowedId of this.settings.getValue("allowedIds")) {
            if (!this.channel.permissionOverwrites.cache.has(allowedId)) {
                if (!this.channel.guild.members.cache.has(allowedId)) {
                    this.channel.guild.members.fetch(allowedId).then(() => {
                        this.channel.permissionOverwrites.create(this.channel.guild.members.cache.get(allowedId).user, { VIEW_CHANNEL: true, READ_MESSAGE_HISTORY: true })
                    });
                }
            }
        }*/

        this.sendInfoEmbed();
    }

    sendInfoEmbed() {
        // console.log(this.license, this.settings);
        this.channel.messages.fetch({ limit: 100 }).then(messages => { messages.forEach(message => { message.delete() }) })
        const roomManagerEmbed = new Discord.MessageEmbed()
            .setColor('#1900ff')
            .setTitle(this.language["ROOM_EMBED_TITLE"])
            .setDescription(this.language["ROOM_EMBED_DESCRIPTION"])
            .setThumbnail(this.language["ROOM_EMBED_THUMBNAIL"])
            .setTimestamp()
            .setFooter(this.language["ROOM_EMBED_FOOTER"])
            .addFields({ name: this.language["ROOM_EMBED_FIELD_1"], value: this.license })
            .addFields({ name: this.language["ROOM_EMBED_FIELD_2"], value: "Name: " + this.settings.getValue("firstIP").name + " , IP: " + this.settings.getValue("firstIP").ip })
            .addFields({ name: this.language["ROOM_EMBED_FIELD_3"], value: "Name: " + this.settings.getValue("secondIP").name + " , IP: " + this.settings.getValue("secondIP").ip });

        this.channel.send({ embeds: [roomManagerEmbed] });
    }

    setUserId(userId) {
        this.userId = userId;
    }

    getUserId() {
        return this.userId;
    }

    setLicense(license) {
        this.license = license;
    }

    getLicense() {
        return this.license;
    }

    getSettings() {
        return this.settings;
    }

    getChannel() {
        return this.channel;
    }

    saveSettings() {
        this.mySQLManager.updateSettingsByUserId(this.userId, this.settings.getJSONString());
        this.sendInfoEmbed();
    }
}

module.exports = Room
