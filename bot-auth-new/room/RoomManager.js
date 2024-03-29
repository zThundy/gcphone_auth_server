const Utils = require('../utils');
const Room = require('./Room');
const RoomSettings = require('./RoomSettings');
const Colors = require("../colors");
const colors = new Colors();

class RoomManager {
    constructor(client, rooms, mySQLManager, currentServer, config) {
        // rooms is the database data
        // mysqlmanager is the connection manager
        // config is the config json

        this.rooms = new Map();
        this.client = client;
        this.mySQLManager = mySQLManager;
        this.currentServer = currentServer;
        this.config = config;
        this.roomChannels = this.getRoomChannels();

        this.utils = new Utils();

        console.log(colors.changeColor("yellow", "Loading users rooms..."));
        var currentRoomChannel;
        rooms.forEach(roomData => {
            // check if room exists
            currentRoomChannel = this.utils.getRoomByUserID(this.roomChannels, this.currentServer, roomData.user_id);
            if (currentRoomChannel === undefined) {
                // check if user exists
                this.currentServer.members.fetch(roomData.user_id)
                    .then(member => {
                        console.log(colors.changeColor("red", "Unable to load a room for the user " + roomData.user_id + ", since there isn't a room for this user!"));
                        client.logger.log("error", {
                            action: "Error",
                            content: "Unable to load a room for the user " + roomData.user_id + ", since there isn't a room for this user!"
                        });
                        if (this.config.shouldCreateNonExistingRooms) this.createRoomForID({ userId: roomData.user_id, license: roomData.license, settings: roomData.settings });
                    })
                    .catch(() => {
                        console.log(colors.changeColor("red", "The user with the id " + roomData.user_id + ", have a room, but is not in the discord!"))
                        client.logger.log("error", {
                            action: "Error",
                            content: "The user with the id " + roomData.user_id + ", have a room, but is not in the discord!"
                        });
                    });

                // get the room channel and delete it
                if (roomData.room_id) {
                    this.currentServer.channels.fetch(roomData.room_id).then(channel => {
                        console.log(colors.changeColor("red", "Room of user " + roomData.user_id + ", has been deleted successfully!"))
                        client.logger.log("error", {
                            action: "Error",
                            content: "Room of user " + roomData.user_id + ", has been deleted successfully!"
                        });
                        channel.delete();
                        this.mySQLManager.clearChannelId({ room_id: roomData.room_id });
                    })
                    .catch(e => {
                        console.log(colors.changeColor("red", "Can't delete room of user " + roomData.user_id + ", since the channel doesn't exist!"))
                        client.logger.log("error", {
                            action: "Error",
                            content: "Can't delete room of user " + roomData.user_id + ", since the channel doesn't exist!"
                        });
                    });
                }

                return;
            }

            // update room id, and license anyways
            this.mySQLManager.updateRoom({ user_id: roomData.user_id, room_id: currentRoomChannel, license: roomData.license });

            this.rooms.set(roomData.user_id, new Room({ language: this.config.language.personalRooms, userId: roomData.user_id, license: roomData.license, roomSettings: new RoomSettings(roomData.settings), channel: this.currentServer.channels.cache.get(currentRoomChannel) }, this.mySQLManager));
            console.log(colors.changeColor("blue", "Loaded room for user " + roomData.user_id));
        })
        console.log(colors.changeColor("green", "Done loading users rooms. Loaded " + this.rooms.size + " rooms."));
    }

    getRooms() {
        return this.rooms;
    }

    createRoomForID(data) {
        var useCategoryId = null;
        this.currentServer.members.fetch(data.userId).then(async () => {
            console.log(colors.changeColor("yellow", "Searching for free of space category"))
            for (var i in this.config.licenseManagerTicketCategory) {
                if (useCategoryId) break;
                const categoryId = this.config.licenseManagerTicketCategory[i];
                useCategoryId = await this.currentServer.channels.fetch(categoryId).then(channel => {
                    if ((Number(channel.children.size) + 1) <= 50) {
                        return channel;
                    }
                })
            }
            console.log(colors.changeColor("green", "Found category with space: " + useCategoryId))
            const username = this.currentServer.members.cache.get(data.userId).user.username
            console.log(colors.changeColor("yellow", "Creating channel for " + username))
            this.currentServer.channels.create("licenza-" + username, {
                "parent": useCategoryId,
                "permissionOverwrites": [ 
                    {
                        id: this.client.user.id,
                        allow: ['SEND_MESSAGES']
                    },
                    {
                        id: this.config.roles.admin,
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES']
                    },
                    {
                        id: data.userId,
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES']
                    },
                    {
                        id: this.currentServer.roles.cache.find(r => r.name === '@everyone'),
                        deny: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY','SEND_MESSAGES']
                    }
                ]
            }).then(roomChannel => {
                console.log(colors.changeColor("green", "Channel for user " + username + " created"))
                var license = data.license || this.utils.getRandomString(40);
                var roomSettings = data.settings || new RoomSettings();
                this.mySQLManager.getRoomByUserId(data.userId, function(roomData) {
                    if (roomData.length == 0) {
                        this.mySQLManager.addRoom({ user_id: data.userId, room_id: roomChannel.id, license: license, settings: roomSettings.getJSONString() });
                    } else {
                        license = roomData.license;
                        roomSettings = new RoomSettings(roomData.settings);
                    }
                    this.rooms.set(data.userId, new Room({ userId: data.userId, license: license, roomSettings: roomSettings, channel: roomChannel }, this.mySQLManager));
                    this.roomChannels.push(roomChannel.id);
                }.bind(this));
            });
        });
    }

    transferLicense(userId, newUserId) {
        var roomData = { license: this.rooms.get(userId).getLicense(), settings: this.rooms.get(userId).getSettings() };
        this.revokeLicense(userId);
        this.createRoomForID({ userId: newUserId, license: roomData.license, settings: roomData.settings });
    }

    revokeLicense(userId) {
        const username = this.currentServer.members.cache.get(userId).user.username
        console.log(colors.changeColor("yellow", "Deleting " + username + "'s room"))
        if (!this.rooms.has(userId)) { return; }
        this.roomChannels.splice(this.roomChannels.indexOf(this.rooms.get(userId).channel.id), 1);
        this.rooms.get(userId).getChannel().delete();
        this.rooms.delete(userId);
        this.mySQLManager.removeRoomByUserId(userId);
        console.log(colors.changeColor("green", "Deleted " + username + "'s room"))
    }

    removeRoom(room) {
        this.roomChannels.splice(this.roomChannels.indexOf(this.rooms.get(room.userId).channel.id), 1);
        this.rooms.delete(room.userId);
    }

    getRoomByUserId(userId) {
        return this.rooms.get(userId);
    }

    getRoomByChannelId(channelId) {
        var foundRoom;
        for (var room of this.rooms.keys()) {
            if (this.rooms.get(room).channel.id == channelId) {
                foundRoom = this.rooms.get(room);
                
                break;
            }
        }
        return foundRoom;
    }

    /*
        OLD AND UNUSED FUNCTION

        getRoomChannels() {
            return this.roomChannels;
        }
    */

    getRoomChannels() {
        const roomChannels = [];
        for (var key of this.currentServer.channels.cache.keys()) {
            var currentElem = this.currentServer.channels.cache.get(key);
            for (var id in this.config.licenseManagerTicketCategory)
                if (currentElem.parentId === this.config.licenseManagerTicketCategory[id] && currentElem.id !== this.config.licenseManagerTicketChannel)
                    roomChannels.push(key);
        }
        this.roomChannels = roomChannels;
        return roomChannels;
    }
}

module.exports = RoomManager