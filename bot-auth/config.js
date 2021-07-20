const config = {
    discord_token: "ODY3MDI1MTU5NTUzNDE3Mjc3.YPbGGg.FWCdkz-7JkLwMpN01LAToqZ9QsY",
    default_license_length: 40,
    mysql: {
        host: 'localhost',
        user: 'root',
        password: 'FBp2P4YGh7JcP7us',
        database: 'bot'
    },
    guild_info: {
        guild_id: "561323825476796568", // the guild id of the server the bot will look for users and roles
        channel_id: "867048942335164496", // id of the channel the bot will look for messagess
        role_id: "847188219023720499" // the role id that will enable a user by using the bot or not
    },
    bot_info: {
        command_prefix: "!",
    }
}

module.exports = config;