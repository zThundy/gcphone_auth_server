const config = require("../config");
const utils = require("../utils");

exports.onMessage = (message, channel, guild, extradata) => {
    // console.log(guild.members);
    // console.log(guild.roles)
    if (message.author.id != "341296805646041100") {
        return utils.noEmbed("You can't execute this command 😰", channel)
    }
    // const Role = guild.roles.cache.find(role => role.id == config.guild_info.role_id);
    // const Members = guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => [member.user.tag, member.user.id]);
    const Members = guild.roles.cache.get(config.guild_info.role_id).members.map(member => [member.user.tag, member.user.id]);
    console.log(Members)
    CheckUser(extradata, Members, 0, channel)
}

const CheckUser = (extradata, tb, index, channel) => {
    console.log("received arguments on checkuser function", tb[index], index);
    if (tb[index]) {
        extradata.conn.query("SELECT * FROM licenses WHERE discord_id = ?", [tb[index][1]], (err, r, _) => {
            if (err) throw err;
            console.log("before the undefined check", JSON.stringify(r[0]), tb[index][0], tb[index][1])
            if (r[0] === undefined) {
                console.log("after the undefined check", JSON.stringify(r[0]), tb[index][0], tb[index][1])
                extradata.conn.query("INSERT INTO licenses(discord_id, license) VALUES(?, ?)", [tb[index][1], utils.createLicense(40)], (err, i, _) => {
                    console.log(JSON.stringify(i));
                    if (err) throw err;
                    extradata.conn.query("SELECT * FROM ips WHERE account_id = ?", [i.insertId], (err, ips, _) => {
                        if (err) throw err;
                        if (ips[0] === undefined || ips[1] === undefined) {
                            extradata.conn.query("INSERT INTO ips(account_id) VALUES(?)", [i.insertId], (err, __, _) => {
                                if (err) throw err;
                                extradata.conn.query("INSERT INTO ips(account_id) VALUES(?)", [i.insertId], (err, __, _) => {
                                    if (err) throw err;
                                    if (tb[index + 1]) {
                                        CheckUser(extradata, tb, index + 1, channel);
                                    } else {
                                        utils.yesEmbed("Inserting of users and ips done 😎", channel)
                                    }
                                });
                            });
                        } else { 
                            if (tb[index + 1]) {
                                CheckUser(extradata, tb, index + 1, channel);
                            } else {
                                utils.yesEmbed("Inserting of users and ips done 😎", channel)
                            }
                        }
                    });
                })
            } else {
                if (tb[index + 1]) {
                    CheckUser(extradata, tb, index + 1, channel);
                } else {
                    utils.yesEmbed("Inserting of users and ips done 😎", channel)
                }
            }
        })
    }
}