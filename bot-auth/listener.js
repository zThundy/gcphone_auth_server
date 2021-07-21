const fs = require("fs");
const c = require("./colors");
const colors = new c();

const utils = require("./utils");

class Listener {
    constructor(mysql, client, config) {
        this.connection = mysql.connection;
        this.client = client;
        this.config = config;

        this.commands = [];
        console.log(colors.changeColor("cyan", "Listener created successfully"));
    }

    buildCommands() {
        fs.readdir("./commands", (err, files) => {
            if (err) throw err;
            files.forEach((file) => {
                // remove the .js extention from the file
                var cmd_name = file.substr(0, file.length - 3);
                // add the command to the commands list for future calls
                this.commands[cmd_name] = require("./commands/" + cmd_name);
                console.log("Registered command " + colors.changeColor("green", cmd_name));
            })
        })
    }

    start() {
        this.client.on("message", (message) => {
            // check if the sender of the message is a bot or not
            // if it is, them ignore everything happens
            if (message.author.bot) return;
            // check if message is coming from server
            if (message.channel.type === "text") {
                if (message.guild.id !== this.config.guild_info.guild_id) return; // maybe implement autodestruction of bot in the wrong guild?
                // check if message is coming from the correct channel defined in config.js
                if (message.channel.id === this.config.guild_info.channel_id && message.content.indexOf(this.config.bot_info.command_prefix) == 0) {
                    // subtract from the content of the message the prefix
                    var cmd = message.content.substr(this.config.bot_info.command_prefix.length, message.content.length);
                    // check if the command is correct and exists with the public listener
                    if (this.commands[cmd] && this.commands[cmd].onMessage) {
                        this.commands[cmd].onMessage(message, message.channel, message.guild, {conn: this.connection});
                        console.log(colors.changeBackground("green", "Command/listener " + cmd + " executed"));
                    } else {
                        console.log(colors.changeBackground("red", "Command/listener " + cmd + " not found"));
                        message.channel.send(utils.noEmbed("Command not found 🤨"));
                    }
                }
            // check if message is coming from dm's
            } else if (message.channel.type === "dm") {
                // subtract from the content of the message the prefix
                var cmd = message.content.substr(this.config.bot_info.command_prefix.length, message.content.length);
                // check if the command is correct and exists with the private listener
                if (this.commands[cmd] && this.commands[cmd].onPrivateMessage) {
                    this.commands[cmd].onPrivateMessage(message, message.channel, false, {conn: this.connection});
                    console.log(colors.changeBackground("green", "Private command/listener " + cmd + " executed"));
                } else {
                    console.log(colors.changeBackground("red", "Private command/listener " + cmd + " not found"));
                    message.channel.send(utils.noEmbed("Command not found 🤨"));
                }
            }
        })

        this.client.on("guildMemberUpdate", (oldMember, newMember) => {
            console.log("member updated");
        })

        this.client.on("clickButton", async (button) => {
            for (var index in this.commands) {
                if (this.commands[index].onbuttonClick && this.commands[index].definedButtons && this.commands[index].definedButtons.find(btn => btn === button.id)) {
                    this.connection.query("SELECT * FROM licenses WHERE discord_id = ?", [button.clicker.id], (err, r, fields) => {
                        if (r && r[0]) {
                            this.commands[index].onbuttonClick(button, button.message, button.channel, {conn: this.connection, account_id: r[0].id });
                        } else {
                            button.message.edit(utils.noEmbed("There was an error 😰"));
                            button.reply.defer();
                        }
                    })
                    break;
                }
            }
        })
    }
}

module.exports = Listener;