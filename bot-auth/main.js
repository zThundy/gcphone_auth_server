const discord = require("discord.js");
const client = new discord.Client();
const config = require("./config");
const MySQL = require("./mysql-class");

client.login(config.discord_token);

client.on("ready", () => {
    const mysql = new MySQL(config.mysql);
    console.log("Discord API ready: listening started");
});