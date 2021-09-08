const Utils = require('../utils');
const Room = require('./Room');
const RoomSettings = require('./RoomSettings');

class RoomManager {
    constructor(client, rooms, mySQLManager, currentServer, roomChannels, config) {
        this.rooms = new Map();
        this.client = client;
        this.mySQLManager = mySQLManager;
        this.currentServer = currentServer;
        this.roomChannels = roomChannels;
        this.config = config;

        this.utils = new Utils();

        console.log("Loading users rooms...");
        var currentRoomChannel;
        rooms.forEach(roomData => {
            currentRoomChannel = this.utils.getRoomByUserID(this.roomChannels, this.currentServer, roomData.user_id);
            if (currentRoomChannel == undefined) { console.log("Unable to load a room for the user", roomData.user_id + ", since there isn't a room for this user!"); return; } /*this.createRoomForID(roomData.user_id); IN CASO DI NECESSITA' */
            this.rooms.set(roomData.user_id, new Room({ userId: roomData.user_id, license: roomData.license, roomSettings: new RoomSettings(roomData.settings), channel: this.currentServer.channels.cache.get(currentRoomChannel) }, this.mySQLManager));
            console.log("Loaded room for user", roomData.user_id);
        })
        console.log("Done loading users rooms.");
    }

    getRooms() {
        return this.rooms;
    }

    createRoomForID(data) {
        this.currentServer.members.fetch(data.userId).then(() => {
            this.currentServer.channels.create("licenza-" + this.currentServer.members.cache.get(data.userId).user.username, { "parent": this.config.licenseManagerTicketCategory, "permissionOverwrites": [ { id: this.client.user.id, allow: ['SEND_MESSAGES'] }, { id: this.config.roles.admin, allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES'] }, { id: data.userId, allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES'] }, { id: this.currentServer.roles.cache.find(r => r.name === '@everyone'), deny: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY','SEND_MESSAGES'] } ] }).then(roomChannel => {
                var license = data.license || this.utils.getRandomString(40);
                var roomSettings = data.settings || new RoomSettings();
                this.mySQLManager.getRoomByUserId(data.userId, function(roomData) {
                    if (roomData.length == 0) {
                        this.mySQLManager.addRoom({user_id: data.userId, license: license, settings: roomSettings.getJSONString()});
                    } else {
                        license = roomData.license;
                        roomSettings = new RoomSettings(roomData.settings);
                    }
                    this.rooms.set(data.userId, new Room({ userId: data.userId, license: license, roomSettings: roomSettings, channel: roomChannel }, this.mySQLManager));
                    this.roomChannels.push(roomChannel.id);
                }.bind(this));
            });
        })
    }

    transferLicense(userId, newUserId) {
        var roomData = { license: this.rooms.get(userId).getLicense(), settings: this.rooms.get(userId).getSettings() };
        this.revokeLicense(userId);
        this.createRoomForID({ userId: newUserId, license: roomData.license, settings: roomData.settings });
    }

    revokeLicense(userId) {
        if (!this.rooms.has(userId)) { return; }
        this.roomChannels.splice(this.roomChannels.indexOf(this.rooms.get(userId).channel.id), 1);
        this.rooms.get(userId).getChannel().delete();
        this.rooms.delete(userId);
        this.mySQLManager.removeRoomByUserId(userId);
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

    getRoomChannels() {
        return this.roomChannels;
    }
}

module.exports = RoomManager