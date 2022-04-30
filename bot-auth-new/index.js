// Utils Classes
const fs = require('fs');
const aes256 = require("aes256");
// connection socket
var authServerSocket;
const io = require('socket.io')(6969);
// event emitter
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

// random jsons
var config = require('./config.json');

// custom classess
// colored console class
const Colors = require("./colors");
const colors = new Colors();
// utility class
const Utils = require('./utils');
const utils = new Utils();
// mysql connection manager
const SQLiteManager = require('./classes/SQLiteManager');
// discord tokens manager
const TokenManager = require('./token/TokenManager');
// Room Classes
// const Room = require('./room/Room');
// const RoomSettings = require('./room/RoomSettings');
const RoomManager = require('./room/RoomManager');
const RoomButtonHandler = require('./room/RoomButtonHandler');
// Language manager
const LangManager = require('./classes/LangManager');
const language = new LangManager("general");
const language_button = new LangManager("commands");
// Autoresponder
const AutoResponder = require('./classes/AutoRespond');
const responder = new AutoResponder();
// Logger
const Logger = require("./classes/Logger");
const logger = new Logger(config);

io.on('connection', (IOSocket) => {
    console.log(colors.changeBackground("green", "Socket connected"));
    authServerSocket = IOSocket;
    eventEmitter.emit('onIPUpdate');
});

// Anti-Spam

const interactionDelay = new Map();
interactionDelay.set("button", []);
interactionDelay.set("contextMenu", []);
interactionDelay.set("command", new Map());

// Commands Classes

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = new Map();
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.data.name.toLowerCase().replaceAll(" ", ""), command);
    if (command.spamDelay) {
        interactionDelay.get("command").set(command.data.name.toLowerCase().replaceAll(" ", ""), new Map());
        // console.log(command.data.name.toLowerCase().replaceAll(" ", ""),  interactionDelay.get("command").get(command.data.name.toLowerCase().replaceAll(" ", "")))
    }
}

// Discord

// maybe added for error by vscode?
// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');
// const { Console } = require('console');
// const { Socket } = require('dgram');

const Discord = require('discord.js');

const Intents = Discord.Intents;
const client = new Discord.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]
});

// Variables

var roomManager;
var tokenManager;
var currentServer;
var roomButtonHandler;

eventEmitter.once("mysql_connection_ready", function (a) {
    console.log(colors.changeBackground("yellow", "SQL module ready, enstablishing connection with discord..."))
    client.login(config.token);
});

const sqliteManager = new SQLiteManager({
    eventEmitter: eventEmitter
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
});

client.once("ready", () => {
    client.logger = logger;

    console.log(colors.changeBackground("green", "Starting up the discordjs client"));
    currentServer = client.guilds.cache.get(config.authoritativeDiscord);

    // config.roles.admin = "" + currentServer.roles.cache.find(r => r.name === 'Dev');
    // config.roles.customer = "" + currentServer.roles.cache.find(r => r.name === '💰 zthPhone Customer');
    // config.roles.everyone = "" + currentServer.roles.cache.find(r => r.name === '@everyone');

    saveConfig();

    /* 
        When developing for the bot, uncomment this
    */
    // return;

    /*
        client.application.commands.fetch().then(() => {
            for (var command of client.application.commands.cache) {
                client.application.commands.delete(command[0]);
                console.log("Deleted command", command[1].name);
            }
        });
    */

    console.log(colors.changeBackground("yellow", "Cleaning commands for guild " + config.authoritativeDiscord + "..."));

    currentServer.commands.fetch().then(() => {
        for (var command of currentServer.commands.cache) {
            currentServer.commands.delete(command[0]);
            console.log(colors.changeColor("red", "Deleted command " + command[1].name));
        }
        console.log(colors.changeColor("blue", "Cleaned commands for guild " + config.authoritativeDiscord));
        console.log(colors.changeColor("yellow", "Loading commands for guild " + config.authoritativeDiscord + "..."));
        for (var command of commands.keys()) {
            var currentJSON = commands.get(command).data.toJSON();
            currentServer.commands.create(currentJSON);
            console.log(colors.changeColor("magenta", "Loaded command " + command));
        }
        console.log(colors.changeColor("green", "Loaded commands for guild " + config.authoritativeDiscord));
        console.log(colors.changeColor("yellow", "Loading permissions for guild " + config.authoritativeDiscord + "..."));
        setTimeout(() => {
            currentServer.commands.fetch().then(() => {
                console.log(colors.changeColor("yellow", "Fetched commands to set permissions on..."));
                var currentCommand;
                for (var command of currentServer.commands.cache.keys()) {
                    currentCommand = currentServer.commands.cache.get(command);
                    currentServer.commands.permissions.set({
                        command: currentCommand.id,
                        permissions: commands.get(currentCommand.name.toLowerCase().replaceAll(" ", "")).permissions
                    })
                    console.log(colors.changeColor("blue", "Loaded permissions for command " + currentCommand.name));
                }
                console.log(colors.changeColor("green", "Loaded permissions for guild " + config.authoritativeDiscord));
            });
        }, 60 * 1000)
    });

    console.log(colors.changeColor("yellow", "Initializing room manager"))
    sqliteManager.getRooms(function (rooms) {
        roomManager = new RoomManager(client, rooms, sqliteManager, currentServer, config);
        tokenManager = new TokenManager();
        roomButtonHandler = new RoomButtonHandler(client, currentServer, roomManager, tokenManager, config);
    });
    console.log(colors.changeColor("green", "Room manager initialized"))
    console.log(colors.changeColor("yellow", "Createing event emitter 'onIPUpdate' for socket IO"))
    eventEmitter.on('onIPUpdate', () => {
        const JSONData = { authServerIPs: {} };
        var currentSettings;
        for (var room of roomManager.getRooms()) {
            currentSettings = room[1].getSettings();
            if (utils.validateIPaddress(currentSettings.getValue("firstIP").ip)) {
                JSONData.authServerIPs[currentSettings.getValue("firstIP").ip] = [currentSettings.getValue("firstIP").name, room[1].license];
            }
            if (utils.validateIPaddress(currentSettings.getValue("secondIP").ip)) {
                JSONData.authServerIPs[currentSettings.getValue("secondIP").ip] = [currentSettings.getValue("secondIP").name, room[1].license];
            }
        }
        // authServerSocket.emit('updateIPTables', aes256.encrypt(config.authToken, "test")); PER TESTING
        authServerSocket.emit('updateIPTables', aes256.encrypt(config.authToken, JSON.stringify(JSONData.authServerIPs)));
    });
    console.log(colors.changeColor("green", "Event emitter 'onIPUpdate' for socket IO initialized successfully"))
})

client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isButton()) {
            logger.log({
                action: interaction.type,
                content: interaction.member.user.username + " ha utilizzato un bottone (" + interaction.customId + ")"
            });
            if (interactionDelay.get("button").includes(interaction.member.user.id)) {
                return;
            }
            if (interaction.customId == "creaStanza") {
                roomButtonHandler.handleButton(interaction);
            }
            interactionDelay.get("button").push(interaction.member.user.id);
            setTimeout(() => {
                interactionDelay.get("button").splice(interactionDelay.get("button").indexOf(interaction.member.user.id), 1)
            }, 2000)
        } else if (interaction.isCommand()) {
            logger.log({
                action: interaction.type,
                content: interaction.member.user.username + " ha utilizzato un comando (" + interaction.commandName + ")"
            });
            
            if (interactionDelay.get("command").get(interaction.commandName).has(interaction.member.user.id)) {
                await interaction.reply({
                    content: language.getString("CANT_USE_COMMAND_COOLDOWN", utils.getRemainingTime(Date.now(), interactionDelay.get("command").get(interaction.commandName).get(interaction.member.user.id))),
                    ephemeral: true
                });
                return;
            }
            commands.get(interaction.commandName).execute(interaction, {
                room: roomManager.getRoomByChannelId(interaction.channelId),
                mLanguage: language,
                eventEmitter,
                roomChannels: roomManager.getRoomChannels(),
                tokenManager,
                roomManager,
                client
            });
            if (interaction.member.roles.cache.find(r => r.id === config.roles.admin) === undefined) {
                interactionDelay.get("command").get(interaction.commandName).set(interaction.member.user.id, Date.now() + commands.get(interaction.commandName).spamDelay * 1000);
            }
            setTimeout(() => {
                interactionDelay.get("command").get(interaction.commandName).delete(interaction.member.user.id)
            }, commands.get(interaction.commandName).spamDelay * 1000)

        } else if (interaction.isContextMenu()) {
            logger.log({
                action: interaction.type,
                content: interaction.member.user.username + " ha utilizzato un comando da un context menu (" + interaction.commandName + ")"
            });
            if (interactionDelay.get("contextMenu").includes(interaction.member.user.id)) {
                return;
            }
            if (interaction.commandName == language_button.getString("ATTIVATOKEN_NAME")) {
                commands.get(interaction.commandName.toLowerCase().replaceAll(" ", "")).execute(interaction, tokenManager);
            }
            interactionDelay.get("contextMenu").push(interaction.member.user.id);
            setTimeout(() => {
                interactionDelay.get("contextMenu").splice(interactionDelay.get("contextMenu").indexOf(interaction.member.user.id), 1)
            }, 2000)
        }
    } catch(e) {
        logger.log("error", {
            action: `ERROR: Event 'interactionCreate', Type: ${interaction.type || 'UNDEFINED'}`,
            content: e
        });
    }
});

client.on('guildMemberAdd', member => {
    sqliteManager.getRoomByUserId(member.id, (room) => {
        if (room !== undefined) {
            roomManager.createRoomForID({ userId: room.user_id, license: room.license, settings: room.settings })
        }    
    });
});

client.on("guildCreate", function (guild) {
    if (guild.id != config.authoritativeDiscord) {
        guild.members.cache.get(guild.ownerID).send({
            content: language.getString("GUILD_CREATE_ERROR_1")
        });
        guild.leave();
        return;
    }
    var id = 0;
    config.licenseManagerTicketCategory.forEach(() => {
        id += 1;
        guild.channels.create(language.getString("LICENSE_CATEGORY_PREFIX", id), {
            "type": 4,
            "permissionOverwrites": [{
                id: config.roles.customer,
                allow: ['VIEW_CHANNEL']
            }, {
                id: guild.roles.cache.find(r => r.name === '@everyone'),
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
            }]
        }).then(channel => {
            if (id == 1) {
                config.licenseManagerTicketCategory[0] = channel.id;
                guild.channels.create(language.getString("LICENSE_MAIN_ROOM_TITLE"), {
                    "parent": channel.id,
                    "permissionOverwrites": [{
                        id: client.user.id,
                        allow: ['SEND_MESSAGES']
                    }, {
                        id: config.roles.customer,
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES']
                    }, {
                        id: guild.roles.cache.find(r => r.name === '@everyone'),
                        deny: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES']
                    }]
                }).then(roomChannel => {
                    const roomManagerEmbed = new Discord.MessageEmbed()
                        .setColor('#1900ff')
                        .setTitle(language.getString("LICENSE_ROOM_EMBED_TITLE"))
                        .setDescription(language.getString("LICENSE_ROOM_EMBED_DESCRIPTION"))
                        .setThumbnail(language.getString("LICENSE_ROOM_EMBED_THUMBNAIL"))
                        .setTimestamp()
                        .setFooter(language.getString("LICENSE_ROOM_EMBED_FOOTER"));
        
                    let createRoomButton = new Discord.MessageButton()
                        .setCustomId("creaStanza")
                        .setLabel(language.getString("LICENSE_ROOM_BUTTON_TITLE"))
                        .setStyle("PRIMARY")
                        .setEmoji(language.getString("LICENSE_ROOM_BUTTON_EMOJI"));
        
                    let messageActionRow = new Discord.MessageActionRow();
                    messageActionRow.addComponents(createRoomButton)
                    roomChannel.send({
                        embeds: [roomManagerEmbed],
                        components: [messageActionRow]
                    });
                    config.licenseManagerTicketChannel = roomChannel.id;
        
                    saveConfig();
                });
            }
        })
    })
});

/*
client.on("guildDelete", function (guild) {});

client.on("guildMemberUpdate", (oldMember, newMember) => {});

client.on("roleUpdate", function(oldRole, newRole) {});
*/

client.on('messageCreate', message => {
    /**
     * AUTO RESPONDER SYSTEM
     */
    try {
        if (message.author.bot) return;

        if (message.channel.name.includes("ticket-")) {
            if (!message.member.roles.cache.some(role => role.id === config.roles.customer)) {
                if (responder.run(message)) {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#00FF00')
                        .setTitle(language.getString("AUTORESPONSE_MESSAGE_TITLE"))
                        .setDescription(language.getString("AUTORESPONSE_MESSAGE_DESCRIPTION"))
                        .setTimestamp();
                    message.channel.send({ embeds: [embed] });
                }
            }
        }

        /**
         * TAGS SYSTEM
         */
        if (config.tagBypass.includes(message.author.id)) return;
        if (message.mentions.roles.size > 0) {
            for (var i in config.blockedTagRoles) {
                if (message.mentions.roles.get(config.blockedTagRoles[i]) && !config.blockedTagRoles.includes(message.author.id)) {
                    message.delete();
                    message.reply(language.getString("DO_NOT_USE_TAGS")).then(sentMessage => {
                        setTimeout(() => {
                            if (!sentMessage.deleted) {
                                sentMessage.delete();
                            }
                        }, 120 * 1000)
                    });
                    break;
                }
            }
        }
        if (message.mentions.users.size > 0) {
            for (var i in config.blockedTagRoles) {
                if (message.mentions.users.get(config.blockedTagUsers[i]) && !config.blockedTagRoles.includes(message.author.id)) {
                    // message.delete();
                    message.reply(language.getString("DO_NOT_USE_TAGS")).then(sentMessage => {
                        setTimeout(() => {
                            if (!sentMessage.deleted) {
                                sentMessage.delete();
                            }
                        }, 120 * 1000)
                    }).then(() => {
                        message.delete();
                    });
                    break;
                }
            }
        }
    } catch(e) {
        logger.log("error", {
            action: "ERROR: Event 'messageCreate'",
            content: e
        });
    }
});

client.on("channelDelete", function (channel) {
    try {
        if (roomManager == undefined) return;
        var room;
        if ((room = roomManager.getRoomByChannelId(channel.id)) != undefined) roomManager.removeRoom(room);
    } catch(e) {
        logger.log("error", {
            action: "ERROR: Event 'channelDelete'",
            content: e
        });
    }
});

function saveConfig() {
    try {
        var configContentString = JSON.stringify(config, null, 4); // "\t" per i tabs
        const configContent = configContentString.split(",");
        if (fs.existsSync("./config.json"))
            fs.unlinkSync("./config.json");
        for (var configElement of configContent)
            fs.appendFileSync('./config.json', configElement + (configContent.indexOf(configElement) == configContent.length - 1 ? "" : ","), 'utf8');
        const language = require("./language.json");
        config.language = language;
    } catch(e) {
        logger.log("error", {
            action: "ERROR: Function 'saveConfig'",
            content: e
        });
    }
}
