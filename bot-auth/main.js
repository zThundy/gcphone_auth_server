global.discord = require("discord.js");
const client = new global.discord.Client();
const config = require("./config");
const MySQL = require("./mysql-class");
const l = require("./listener");

const c = require("./colors");
const colors = new c();

var version = global.discord.version.split('');
if (version.includes('(')) { version = version.join('').split('(').pop().split(''); }
version = parseInt(version[0] + version[1]);
console.log(colors.changeColor("cyan", "Discord.js version ") + colors.changeColor("blue", version));

client.login(config.discord_token);

client.on("ready", () => {
    const mysql = new MySQL(config.mysql);
    const listener = new l(mysql, client, config);
    listener.buildCommands();
    listener.start();
});