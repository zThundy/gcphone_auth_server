const config = require("../config");
const utils = require("../utils");

exports.onMessage = (message, channel, guild, conn) => {
    const author = message.member;
    if (author._roles.find(r => r === config.guild_info.role_id)) {
        conn.query(`SELECT id FROM licenses WHERE discord_id = ${author.user.id}`, {}, (err, r, fields) => {
            if (err) throw err;
            if (r && r[0]) {
                channel.send(utils.noEmbed("Your license is already stored in the database 🧐"));
            } else {
                conn.query(`INSERT INTO licenses(license, discord_id) VALUES(?, ?)`, [utils.createLicense(config.default_license_length), author.user.id], (err, i, fields) => {
                    if (err) throw err;
                    // const id = i.insertId;
                    channel.send(utils.yesEmbed("Your license has been created and stored in the database 😎"));
                });
            }
        })
    } else {
        channel.send(utils.noEmbed("You're not a customer 😰"));
    }
}