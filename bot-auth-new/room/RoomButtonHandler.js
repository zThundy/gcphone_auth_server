const Utils = require('../utils');
const RoomSettings = require('./RoomSettings');

const Discord = require('discord.js');

class RoomButtonHandler {

    constructor(client, currentServer, roomManager, tokenManager, config) {
        this.client = client;
        this.currentServer = currentServer;
        this.roomManager = roomManager;
        this.tokenManager = tokenManager;
        this.config = config;
        this.utils = new Utils();
    }

    handleButton(button) {
        if (this.hasPermission(button.member.roles.cache.keys())) {
            var userId = button.member.user.id;
            var room;
            if ((room = this.utils.getRoomByUserID(this.roomManager.roomChannels, this.currentServer, userId)) != undefined) { button.reply({ embeds: [this.utils.getEmbedMessage({ colorHex: "#c91212", title: "Creazione Stanza", description: "Hai già una stanza per la gestione delle license e degli ip", timestamp: true, thumbnail: "https://cdn.discordapp.com/attachments/858349668197859378/876547319024218172/dwayne-rock.gif" })], ephemeral: true}).catch(console.error); this.currentServer.channels.cache.get(room).send("<@" + userId + ">").then(sentMessage => sentMessage.delete()); return; }
            if (!this.tokenManager.isUserTokenActivated(userId)) { button.reply({ embeds: [this.utils.getEmbedMessage({ colorHex: "#c91212", title: "Creazione Stanza", description: "Non puoi creare una stanza, non hai attivato il token che ti è stato fornito!", timestamp: true, thumbnail: "https://cdn.discordapp.com/attachments/858349668197859378/877206678066593852/no-no-no-jotaro-kujo.gif" })], ephemeral: true}); return; }
            button.reply({ embeds: [this.utils.getEmbedMessage({ colorHex: "#c91212", title: "Creazione Stanza", description: "Ta sto a fa a stanza nte proccupè", timestamp: true, thumbnail: "https://cdn.discordapp.com/attachments/858349668197859378/876267222782337044/ezgif.com-gif-maker.gif" })], ephemeral: true}).catch(console.error);
            this.roomManager.createRoomForID(userId);
        }
    }

    hasPermission(roles) {
        var hasPermission = false;
        for (var role of roles) {
            if (role == this.config.roles.customer) { hasPermission = true; break; }
        }
        return hasPermission;
    }


}

module.exports = RoomButtonHandler