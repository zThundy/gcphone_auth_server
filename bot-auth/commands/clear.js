const utils = require("./../utils");

exports.onMessage =  (message, channel, guild, extradata) => {
    if (message.author.id != "341296805646041100") {
        return utils.noEmbed("You can't execute this command 😰", channel);
    }

    channel.bulkDelete(100, true).then((_message) => {
        utils.yesEmbed("Deleted 100 messages 😎", channel);
    });
};
    