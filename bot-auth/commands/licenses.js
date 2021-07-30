const { MessageEmbed } = require("discord.js");
// const config = require("../config");
const utils = require("../utils");
const https = require("https");

const { MessageButton, MessageActionRow } = require("discord-buttons");
const buttons = [];
const listeningForMessage = [];
const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const day_ms = 86400000;

const updateRequest = () => {
    const options = {
        hostname: '51.91.91.226',
        port: 5000,
        path: '/dbUpdateRequest',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on('data', d => {
            process.stdout.write(d);
        })
    })

    req.end();
}

exports.onPrivateMessage = (message, channel, guild, _extradata) => {
    buttons["main_menu"] = (extradata, message, edit) => {
        const embed = new MessageEmbed()
            .setColor('#3E8868')
            .setTitle("Here's a list of your ips")
            .addFields([
                {name: "First binded IP", value: extradata.ips[0].ip},
                {name: "Second binded IP", value: extradata.ips[1].ip}
            ])
            .setDescription("License: " + extradata.account.license)
            .setTimestamp()
            .setFooter('Made with ❤️ by zThundy__');
    
        let ip_management_button = new MessageButton()
            .setLabel("IP Management")
            .setID("ip_management")
            .setStyle("grey");
    
        let regenerate_licenses_button = new MessageButton()
            .setLabel("Regenerate Licenses")
            .setID("regen_licenses")
            .setStyle("blurple");
    
        let row = new MessageActionRow()
            .addComponents(ip_management_button, regenerate_licenses_button);

        if (edit) {
            message.edit(embed, row);
        } else {
            message.channel.send(embed, row);
        }

        if (extradata.clicker) listeningForMessage[extradata.clicker.id] = false;
    }

    buttons["ip_management"] = (extradata, message, edit) => {
        const ips = extradata.ips;
        const embed = new MessageEmbed()
            .setColor('#3E8868')
            .setTitle("Choose what ip you want to change")
            .setTimestamp()
            .setFooter('Made with ❤️ by zThundy__');

        let ip_1 = new MessageButton()
            .setLabel(ips[0].ip)
            .setID("change_ip_1")
            .setStyle("green");

        let ip_2 = new MessageButton()
            .setLabel(ips[1].ip)
            .setID("change_ip_2")
            .setStyle("green");

        let back = new MessageButton()
            .setLabel("Main Menu")
            .setID("main_menu")
            .setStyle("red");

        let row = new MessageActionRow()
            .addComponents(ip_1, ip_2, back);

        if (edit) {
            message.edit(embed, row);
        } else {
            message.channel.send(embed, row);
        }

        if (extradata.clicker) listeningForMessage[extradata.clicker.id] = false;
    }

    buttons["change_ip_1"] = (extradata, message, edit) => {
        if (extradata.clicker) listeningForMessage[extradata.clicker.id] = {message, id: extradata.ips[0].id};
        const embed = new MessageEmbed()
            .setColor('#B8B44C')
            .setTitle("Please type the new IP you want to use")
            .setTimestamp()
            .setFooter('Made with ❤️ by zThundy__');

        if (edit) {
            message.edit(embed);
        } else {
            message.channel.send(embed);
        }
    }

    buttons["change_ip_2"] = (extradata, message, edit) => {
        if (extradata.clicker) listeningForMessage[extradata.clicker.id] = {message, id: extradata.ips[1].id};
        const embed = new MessageEmbed()
            .setColor('#B8B44C')
            .setTitle("Please type the new IP you want to use")
            .setTimestamp()
            .setFooter('Made with ❤️ by zThundy__');

        if (edit) {
            message.edit(embed);
        } else {
            message.channel.send(embed);
        }
    }

    buttons["regen_licenses"] = (extradata, message, edit) => {
        const embed = new MessageEmbed()
            .setColor('#B8B44C')
            .setTitle("Are you sure you want to continue?")
            .setTimestamp()
            .setFooter('Made with ❤️ by zThundy__');
    
        let change_license = new MessageButton()
            .setLabel("Yes")
            .setID("yes_change_license")
            .setStyle("green");
    
        let back = new MessageButton()
            .setLabel("No")
            .setID("main_menu")
            .setStyle("red");
    
        let row = new MessageActionRow()
            .addComponents(change_license, back);

        if (edit) {
            message.edit(embed, row);
        } else {
            message.channel.send(embed, row);
        }
    }

    buttons["yes_change_license"] = (extradata, message, edit) => {
        _extradata.conn.query("SELECT * FROM licenses WHERE discord_id = ?", [extradata.clicker.id], (err, r, fields) => {
            if (err) throw err;
            let date = new Date(r[0].last_update);
            let current_date = new Date();
            if (Number(current_date - date) < Number(day_ms * 5)) return utils.noEmbed("You can regenerate a license only after 5 days 😰", channel);
            let new_license = utils.createLicense(40);
            _extradata.conn.query("UPDATE licenses SET license = ? WHERE discord_id = ?", [new_license, extradata.clicker.id], (err, l, _) => {
                if (err) throw err;
                if (r && r[0]) {
                    _extradata.conn.query("SELECT * FROM ips WHERE account_id = ?", [r[0].id], (err, i, fields) => {
                        if (err) throw err;
                        if (i && i[0] && i[1]) {
                            r[0].license = new_license;
                            buttons["main_menu"]({account: r[0], ips: [i[0], i[1]]}, message, true);
                        } else {
                            utils.noEmbed("There are no ips associated to this account 😰", channel);
                        }
                    });
                } else {
                    utils.noEmbed("There was an error 😰", channel);
                }
            });
        });
    }

    _extradata.conn.query("SELECT * FROM licenses WHERE discord_id = ?", [message.author.id], (err, r, fields) => {
        if (err) throw err;
        if (r && r[0]) {
            _extradata.conn.query("SELECT * FROM ips WHERE account_id = ?", [r[0].id], (err, i, fields) => {
                if (err) throw err;
                if (i && i[0] && i[1]) {
                    buttons["main_menu"]({account: r[0], ips: [i[0], i[1]]}, message, false);
                } else {
                    utils.noEmbed("There are no ips associated to this account 😰", channel);
                }
            })
        } else {
            utils.noEmbed("There was an error 😰", channel);
        }
    });
}

exports.init = (client, conn) => {
    client.on("clickButton", async (button) => {
        button.reply.defer();
        conn.query("SELECT * FROM licenses WHERE discord_id = ?", [button.clicker.id], (err, r, fields) => {
            if (err) throw err;
            if (r && r[0]) {
                conn.query("SELECT * FROM ips WHERE account_id = ?", [r[0].id], (err, i, fields) => {
                    if (err) throw err;
                    if (i && i[0] && i[1]) {
                        if (buttons[button.id]) { buttons[button.id]({account: r[0], ips: [i[0], i[1]], clicker: button.clicker}, button.message, true); }
                    } else {
                        utils.noEmbed("There are no ips associated to this account 😰", button.message.channel);
                    }
                })
            } else {
                utils.noEmbed("There was an error 😰", button.message.channel);
            }
        });
    });
    
    client.on("message", (message) => {
        if (listeningForMessage[message.author.id]) {
            if (message.content.match(ipformat)) {
                conn.query("UPDATE ips SET ip = ? WHERE id = ?", [message.content, listeningForMessage[message.author.id].id], (err) => {
                    if (err) throw err;
                    conn.query("SELECT * FROM licenses WHERE discord_id = ?", [message.author.id], (err, r, fields) => {
                        if (err) throw err;
                        if (r && r[0]) {
                            conn.query("SELECT * FROM ips WHERE account_id = ?", [r[0].id], (err, i, fields) => {
                                if (err) throw err;
                                if (i && i[0] && i[1]) {
                                    buttons["main_menu"]({account: r[0], ips: [i[0], i[1]]}, listeningForMessage[message.author.id].message, true);
                                    utils.yesEmbed("IP successfully updated to " + message.content + " 😎", message.channel);
                                    listeningForMessage[message.author.id] = false;
                                } else {
                                    utils.noEmbed("There are no ips associated to this account 😰", message.channel);
                                }
                            });
                        } else {
                            utils.noEmbed("There was an error 😰", message.channel);
                        }
                    });
                });
            } else {
                conn.query("SELECT * FROM licenses WHERE discord_id = ?", [message.author.id], (err, r, fields) => {
                    if (err) throw err;
                    if (r && r[0]) {
                        conn.query("SELECT * FROM ips WHERE account_id = ?", [r[0].id], (err, i, fields) => {
                            if (err) throw err;
                            if (i && i[0] && i[1]) {
                                buttons["main_menu"]({account: r[0], ips: [i[0], i[1]]}, listeningForMessage[message.author.id].message, true);
                                utils.noEmbed("The format you entered was not correct 😰", message.channel)
                                listeningForMessage[message.author.id] = false;
                            } else {
                                utils.noEmbed("There are no ips associated to this account 😰", channel);
                            }
                        })
                    } else {
                        utils.noEmbed("There was an error 😰", channel);
                    }
                });
            }
        }
    })
}