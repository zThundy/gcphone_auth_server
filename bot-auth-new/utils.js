const Discord = require('discord.js');

class Utils {
    constructor() { }

    // colorHex, title, description, thumbnail, timestamp, footer
    defaultEmbedData = {
        thumbnail: "https://cdn.discordapp.com/attachments/858349668197859378/876171558157160478/smurf-funny.gif",
        footer: "Bot fatto da Gasaferic cor core 🥵 🥵 🥵"
    }

    getRemainingTime(startMillis, stopMillis) {
        var elapsedTime = stopMillis - startMillis;
        // console.log(elapsedTime, stopMillis, startMillis)
        var elapsedTimeFormatted = { hours: 0, minutes: 0, seconds: 0 }
        elapsedTimeFormatted.seconds = Math.floor((elapsedTime / 1000));
        if (elapsedTimeFormatted.seconds > 59) { elapsedTimeFormatted.minutes = Math.floor(elapsedTimeFormatted.seconds / 60); elapsedTimeFormatted.seconds = elapsedTimeFormatted.seconds % 60; }
        if (elapsedTimeFormatted.minutes > 59) { elapsedTimeFormatted.hours = Math.floor(elapsedTimeFormatted.minutes / 60); elapsedTimeFormatted.minutes = elapsedTimeFormatted.minutes % 60; }
        if (elapsedTimeFormatted.hours > 23) { elapsedTimeFormatted.days = Math.floor(elapsedTimeFormatted.hours / 24); elapsedTimeFormatted.hours = elapsedTimeFormatted.hours % 24; }
        elapsedTimeFormatted.hours = elapsedTimeFormatted.hours == 1 ? elapsedTimeFormatted.hours + " Ora " : elapsedTimeFormatted.hours + " Ore "
        elapsedTimeFormatted.minutes = elapsedTimeFormatted.minutes == 1 ? elapsedTimeFormatted.minutes + " Minuto " : elapsedTimeFormatted.minutes + " Minuti "
        elapsedTimeFormatted.seconds = elapsedTimeFormatted.seconds == 1 ? elapsedTimeFormatted.seconds + " Secondo" : elapsedTimeFormatted.seconds + " Secondi"
        return elapsedTimeFormatted.hours + elapsedTimeFormatted.minutes + elapsedTimeFormatted.seconds;
    }
  
    getEmbedMessage(embedData) {
        const embedMessage = new Discord.MessageEmbed();
        if (embedData.colorHex) { embedMessage.setColor(embedData.colorHex); }
        if (embedData.title) { embedMessage.setTitle(embedData.title); }
        if (embedData.description) { embedMessage.setDescription(embedData.description); }
        if (embedData.timestamp) { embedMessage.setTimestamp(); }
        if (embedData.fields) { embedMessage.addFields(embedData.fields); }
        embedMessage.setThumbnail(embedData.thumbnail || this.defaultEmbedData.thumbnail);
        embedMessage.setFooter(embedData.footer || this.defaultEmbedData.footer);
        return embedMessage;
    }

    getRoomByUserID(roomChannels, currentServer, userId) {
        var room;
        for (var roomChannel of roomChannels) {
            if (room) break;
            if (currentServer.channels.cache.has(roomChannel))
                for (var permissionOverwrite of currentServer.channels.cache.get(roomChannel).permissionOverwrites.cache.keys())
                    if (permissionOverwrite == userId) {
                        room = roomChannel;
                        break;
                    }
        }
        return room;
    }

    getRandomString(length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }

    regExpIP = new RegExp(/^((?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])[.]){3}(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/);
    validateIPaddress(ip) {
        return this.regExpIP.test(ip);
    }

    // this function returns the current date formatted as
    // "DD-MM-YYYY HH:MM:SS"
    getCurrentDateTime() {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        var hour = currentDate.getHours();
        var minute = currentDate.getMinutes();
        var second = currentDate.getSeconds();
        return day + "-" + month + "-" + year + " " + hour + ":" + minute + ":" + second;
    }
}

module.exports = Utils