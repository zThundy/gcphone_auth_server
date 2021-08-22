// Utils Classes

const fs = require('fs');

const aes256 = require("aes256");

const Utils = require('./utils');
const utils = new Utils();

const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

var config = require('./config.json');

var authServerSocket;
const io = require('socket.io')(6969);

io.on('connection', (IOSocket) => {
  authServerSocket = IOSocket;
  eventEmitter.emit('onIPUpdate');
});

const MySQLManager = require('./MySQLManager');
var mysqlConnectionParams = config.mysql;

const TokenManager = require('./token/TokenManager');

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

// Room Classes

const Room = require('./room/Room');
const RoomManager = require('./room/RoomManager');
const RoomButtonHandler = require('./room/RoomButtonHandler');
const RoomSettings = require('./room/RoomSettings');

// Discord

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const Discord = require('discord.js');
const { Console } = require('console');
const { Socket } = require('dgram');
const Intents = Discord.Intents;
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });

// Variables

var roomManager;
var tokenManager;
var currentServer;
var roomButtonHandler;
var roomChannels;

const mySQLManager = new MySQLManager({ mysqlConnectionParams: mysqlConnectionParams, eventEmitter: eventEmitter });
eventEmitter.once("mysql_connection_ready", function(a) {
  client.login(config.token);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.once("ready", () => {
  console.log("so pronto");

  currentServer = client.guilds.cache.get(config.authoritativeDiscord);

  config.roles.admin = "" + currentServer.roles.cache.find(r => r.name === 'Dev');
  config.roles.customer = "" + currentServer.roles.cache.find(r => r.name === '💰 zthPhone Customer');
  config.roles.everyone = "" + currentServer.roles.cache.find(r => r.name === '@everyone');

  saveConfig();

  /*client.application.commands.fetch().then(() => {
    for (var command of client.application.commands.cache) {
      client.application.commands.delete(command[0]);
      console.log("Deleted command", command[1].name);
    }
  });*/

  console.log("Cleaning commands for guild", config.authoritativeDiscord + "...");

  currentServer.commands.fetch().then(() => {
    for (var command of currentServer.commands.cache) {
      currentServer.commands.delete(command[0]);
      console.log("Deleted command", command[1].name);
    }

    console.log("Cleaned commands for guild", config.authoritativeDiscord);

    console.log("Loading commands for guild", config.authoritativeDiscord + "...");

    for (var command of commands.keys()) {
      var currentJSON = commands.get(command).data.toJSON();
  
      currentServer.commands.create(currentJSON);
      console.log("Loaded command", command);
    }
  
    console.log("Loaded commands for guild", config.authoritativeDiscord);

    currentServer.commands.fetch().then(() => {

      console.log("Loading permissions for guild", config.authoritativeDiscord + "...");

      var currentCommand;
      for (var command of currentServer.commands.cache.keys()) {
        currentCommand = currentServer.commands.cache.get(command);
        currentServer.commands.permissions.set({ command: currentCommand.id, permissions: commands.get(currentCommand.name.toLowerCase().replaceAll(" ", "")).permissions })
        console.log("Loaded permissions for command", currentCommand.name);
      }

      console.log("Loaded permissions for guild", config.authoritativeDiscord);
    });

  });

  roomChannels = getRoomChannels();

  mySQLManager.getRooms(function(rooms) {
    roomManager = new RoomManager(client, rooms, mySQLManager, currentServer, roomChannels, config);
    tokenManager = new TokenManager();
    roomButtonHandler = new RoomButtonHandler(client, currentServer, roomManager, tokenManager, config);
  });
  
})

client.on('interactionCreate', async (interaction) => {
  // console.log(interaction);
  if (interaction.isButton()) {
    log({ action: interaction.type, content: interaction.member.user.username + " ha utilizzato un bottone (" + interaction.customId + ")"});
    if (interactionDelay.get("button").includes(interaction.member.user.id)) { return; }
    if (interaction.customId == "creaStanza") { roomButtonHandler.handleButton(interaction); }
    interactionDelay.get("button").push(interaction.member.user.id);
    setTimeout(() => { interactionDelay.get("button").splice(interactionDelay.get("button").indexOf(interaction.member.user.id), 1) }, 2000)
  } else if (interaction.isCommand()) {
    log({ action: interaction.type, content: interaction.member.user.username + " ha utilizzato un comando (" + interaction.commandName + ")"});
    // console.log(commands.get(interaction.commandName).spamDelay, typeof interactionDelay.get("command").get(interaction.commandName), interactionDelay.get("command").get(interaction.commandName)[interaction.member.user.id]);

    if (interaction.commandName == "ip") {
      if (!roomChannels.includes(interaction.channelId)) { await interaction.reply({content: "Non puoi eseguire questo comando qui!", ephemeral: true}); return; }
      if (interactionDelay.get("command").get(interaction.commandName).has(interaction.member.user.id)) { await interaction.reply({content: "Non puoi eseguire questo comando per " + utils.getRemainingTime(Date.now(), interactionDelay.get("command").get(interaction.commandName).get(interaction.member.user.id)), ephemeral: true}); return; }

      commands.get(interaction.commandName).execute(interaction, roomManager.getRoomByChannelId(interaction.channelId), eventEmitter);
      interactionDelay.get("command").get(interaction.commandName).set(interaction.member.user.id, Date.now() + commands.get(interaction.commandName).spamDelay * 1000);

      setTimeout(() => { interactionDelay.get("command").get(interaction.commandName).delete(interaction.member.user.id) }, commands.get(interaction.commandName).spamDelay * 1000)
    } else if (interaction.commandName == "token") {
      if (config.licenseManagerTicketChannel != interaction.channelId) { await interaction.reply({content: "Non puoi eseguire questo comando qui!", ephemeral: true}); return; }
      if (interactionDelay.get("command").get(interaction.commandName).has(interaction.member.user.id)) { await interaction.reply({content: "Non puoi eseguire questo comando per " + utils.getRemainingTime(Date.now(), interactionDelay.get("command").get(interaction.commandName).get(interaction.member.user.id)), ephemeral: true}); return; }

      commands.get(interaction.commandName).execute(interaction, { tokenManager: tokenManager, roomManager: roomManager });
      interactionDelay.get("command").get(interaction.commandName).set(interaction.member.user.id, Date.now() + commands.get(interaction.commandName).spamDelay * 1000);

      setTimeout(() => { interactionDelay.get("command").get(interaction.commandName).delete(interaction.member.user.id) }, commands.get(interaction.commandName).spamDelay * 1000)
    } else if (interaction.commandName == "activate") {
      if (config.licenseManagerTicketChannel != interaction.channelId) { await interaction.reply({content: "Non puoi eseguire questo comando qui!", ephemeral: true}); return; }
      if (interactionDelay.get("command").get(interaction.commandName).has(interaction.member.user.id)) { await interaction.reply({content: "Non puoi eseguire questo comando per " + utils.getRemainingTime(Date.now(), interactionDelay.get("command").get(interaction.commandName).get(interaction.member.user.id)), ephemeral: true}); return; }

      commands.get(interaction.commandName).execute(interaction, tokenManager);
      interactionDelay.get("command").get(interaction.commandName).set(interaction.member.user.id, Date.now() + commands.get(interaction.commandName).spamDelay * 1000);

      setTimeout(() => { interactionDelay.get("command").get(interaction.commandName).delete(interaction.member.user.id) }, commands.get(interaction.commandName).spamDelay * 1000)
    }

  } else if (interaction.isContextMenu()) {
    log({ action: interaction.type, content: interaction.member.user.username + " ha utilizzato un comando da un context menu (" + interaction.commandName + ")"});
    if (interactionDelay.get("contextMenu").includes(interaction.member.user.id)) { return; }

    if (interaction.commandName == "Attiva Token") {
      commands.get(interaction.commandName.toLowerCase().replaceAll(" ", "")).execute(interaction, tokenManager);
    }

    interactionDelay.get("contextMenu").push(interaction.member.user.id);
    setTimeout(() => { interactionDelay.get("contextMenu").splice(interactionDelay.get("contextMenu").indexOf(interaction.member.user.id), 1) }, 2000)
  }
});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
client.on("guildMemberUpdate", (oldMember, newMember) => {
});

client.on("guildCreate", function(guild){
  if (guild.id != config.authoritativeDiscord) { guild.members.cache.get(guild.ownerID).send({content: "I've been added to a non authoritative Discord Server, not good! 😡 😡 😡"}); guild.leave(); return; }
  guild.channels.create("Gestione Licenze", { "type": 4, "permissionOverwrites": [ { id: config.roles.customer, allow: ['VIEW_CHANNEL'] }, { id: guild.roles.cache.find(r => r.name === '@everyone'), deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'] } ] }).then(channel => {
    config.licenseManagerTicketCategory = channel.id;
    guild.channels.create("🎫 Crea Stanza", { "parent": channel.id, "permissionOverwrites": [ { id: client.user.id, allow: ['SEND_MESSAGES'] }, { id: config.roles.customer, allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'SEND_MESSAGES'] }, { id: guild.roles.cache.find(r => r.name === '@everyone'), deny: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY','SEND_MESSAGES'] } ] }).then(roomChannel => {
      console.log("-------------------------------------------------");
      console.log(roomChannel);

      const roomManagerEmbed = new Discord.MessageEmbed()
      .setColor('#1900ff')
      .setTitle('Gestione Stanza Licenze')
      .setDescription('Clicca il bottone qui sotto per creare una stanza personale per la gestione della licenza e dell\'ip. Se esiste una tua stanza personale verrai taggato in quella stanza.')
      .setThumbnail('https://cdn.discordapp.com/attachments/858349668197859378/876171558157160478/smurf-funny.gif')
      .setTimestamp()
      .setFooter('Bot fatto da Gasaferic cor core');
      
      let createRoomButton = new Discord.MessageButton()
      .setCustomId("creaStanza")
      .setLabel("Crea una stanza")
      .setStyle("PRIMARY")
      .setEmoji("😱");

      let messageActionRow = new Discord.MessageActionRow();
      messageActionRow.addComponents(createRoomButton)

      roomChannel.send({ embeds: [roomManagerEmbed], components: [messageActionRow] });

      config.licenseManagerTicketChannel = roomChannel.id;

      saveConfig();
    });
  });
});

client.on("guildDelete", function(guild){
});

client.on('messageCreate', message => {
  if (message.content.startsWith('!')) {
    message.delete();
  }
});

client.on("channelDelete", function(channel){
  if (roomManager == undefined) { return; }
  var room;
  if ((room = roomManager.getRoomByChannelId(channel.id)) != undefined) {
    roomManager.removeRoom(room);
  }
});

function getRoomChannels() {
  const roomChannels = [];
  var currentElem;
  for (var key of currentServer.channels.cache.keys()) {
    currentElem = currentServer.channels.cache.get(key);
    if (currentElem.parentId == config.licenseManagerTicketCategory && currentElem.id != config.licenseManagerTicketChannel) {
      roomChannels.push(key);
    }
  }
  return roomChannels;
}

eventEmitter.on('onIPUpdate', function() {
  const JSONData = { authServerIPs: {} };
  var currentSettings;
  for (var room of roomManager.getRooms()) {
    currentSettings = room[1].getSettings();
    if (utils.validateIPaddress(currentSettings.getValue("firstIP").ip)) { JSONData.authServerIPs[currentSettings.getValue("firstIP").ip] = [currentSettings.getValue("firstIP").name, room[1].license]; }
    if (utils.validateIPaddress(currentSettings.getValue("secondIP").ip)) { JSONData.authServerIPs[currentSettings.getValue("secondIP").ip] = [currentSettings.getValue("secondIP").name, room[1].license]; }
  }
  // console.log(JSONData.authServerIPs);
  // authServerSocket.emit('updateIPTables', aes256.encrypt(config.authToken, "test")); PER TESTING
  authServerSocket.emit('updateIPTables', aes256.encrypt(config.authToken, JSON.stringify(JSONData.authServerIPs)));
});

/*

client.on("roleUpdate", function(oldRole, newRole) {
});

*/

const fusoOrario = 2;
function log(data) {
  var currentDate = new Date(Date.now() + (fusoOrario * (60 * 60 * 1000)));
  fs.appendFileSync("./logs_" + (currentDate.getDate() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getFullYear()) + ".txt", ("[" + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds() + "]") + " > " + data.action + ": " + data.content + "\n", 'utf8');
}

function saveConfig() {
  var configContentString = JSON.stringify(config, null, 2); // "\t" per i tabs
  const configContent = configContentString.split(",");
  if (fs.existsSync("./config.json")) { fs.unlinkSync("./config.json") }
  for (var configElement of configContent) {
    fs.appendFileSync('./config.json', configElement + (configContent.indexOf(configElement) == configContent.length - 1 ? "" : ","), 'utf8');
  }
}
