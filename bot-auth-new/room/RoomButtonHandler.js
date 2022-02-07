const LangManager = require('../classes/LangManager');
const Utils = require('../utils');
// maybe added by vscode auto
// const RoomSettings = require('./RoomSettings');
// const Discord = require('discord.js');

class RoomButtonHandler {
    constructor(client, currentServer, roomManager, tokenManager, config) {
        this.client = client;
        this.currentServer = currentServer;
        this.roomManager = roomManager;
        this.tokenManager = tokenManager;
        this.config = config;
        this.language = new LangManager("buttonRooms")
        this.utils = new Utils();
    }

    handleButton(button) {
        if (this.hasPermission(button.member.roles.cache.keys())) {
            var userId = button.member.user.id;
            var room;
            if ((room = this.utils.getRoomByUserID(this.roomManager.roomChannels, this.currentServer, userId)) != undefined) {
                button.reply({
                    embeds: [
                        this.utils.getEmbedMessage({
                            colorHex: "#c91212",
                            title: this.language.getString("BUTTON_TITLE"),
                            description: this.language.getString("BUTTON_PRESS_ERROR_1"),
                            timestamp: true,
                            thumbnail: this.language.getString("BUTTON_PRESS_ERROR_THUMBNAIL_1")
                        })
                    ],
                    ephemeral: true
                }).catch(console.error);
                this.currentServer.channels.cache.get(room).send("<@" + userId + ">").then(sentMessage => sentMessage.delete());
                return;
            }
            if (!this.tokenManager.isUserTokenActivated(userId)) {
                button.reply({
                    embeds: [
                        this.utils.getEmbedMessage({
                            colorHex: "#c91212",
                            title: this.language.getString("BUTTON_TITLE"),
                            description: this.language.getString("BUTTON_PRESS_ERROR_2"),
                            timestamp: true,
                            thumbnail: this.language.getString("BUTTON_PRESS_ERROR_THUMBNAIL_2")
                        })
                    ],
                    ephemeral: true
                });
                return;
            }
            button.reply({
                embeds: [
                    this.utils.getEmbedMessage({
                        colorHex: "#c91212",
                        title: this.language.getString("BUTTON_TITLE"),
                        description: this.language.getString("BUTTON_PRESS_SUCCESS"),
                        timestamp: true,
                        thumbnail: this.language.getString("BUTOON_PRESS_SUCCESS_THUMBNAIL")
                    })
                ],
                ephemeral: true
            }).catch(console.error);
            this.roomManager.createRoomForID({ userId: userId });
        } else {
            button.reply({
                embeds: [
                    this.utils.getEmbedMessage({
                        colorHex: "#c91212",
                        title: this.language.getString("BUTTON_TITLE"),
                        description: this.language.getString("BUTTON_PRESS_ERROR_2"),
                        timestamp: true,
                        thumbnail: this.language.getString("BUTTON_PRESS_ERROR_THUMBNAIL_2")
                    })
                ],
                ephemeral: true
            });
        }
    }

    hasPermission(roles) {
        var hasPermission = false;
        for (var role of roles)
            if (role == this.config.roles.customer) { hasPermission = true; break; }
        return hasPermission;
    }
}

module.exports = RoomButtonHandler