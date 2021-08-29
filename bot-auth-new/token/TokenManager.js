const Utils = require('../utils');

class TokenManager {
    constructor() {
        this.tokens = new Map();
        this.utils = new Utils();
    }

    registerToken(userId) {
        this.tokens.set(userId, [this.getRandomToken(), false]);
        setTimeout(() => { this.revokeTokenByUserId(userId); }, (1000 * 60) * 30);
        return this.tokens.get(userId)[0];
    }

    getTokenByUserId(userId) {
        return this.tokens.get(userId);
    }

    getUserIdByToken(token) {
        var userId;
        for (var key of this.tokens.keys()) {
            if (this.tokens.get(key)[0] == token) {
                userId = key;
                break;
            }
        }
        return userId;
    }

    revokeToken(token) {
        return this.revokeTokenByUserId(this.getUserIdByToken(token));
    }

    revokeTokenByUserId(userId) {
        return this.tokens.delete(userId);
    }

    isUserTokenActivated(userId) {
        var token = this.getTokenByUserId(userId);
        return token != undefined && token[1];
    }

    activateToken(userId, token) {
        var tokenInfo = this.tokens.get(userId);
        if (tokenInfo == undefined) { return false; }
        if (tokenInfo[0] != token) { return false; }
        if (tokenInfo[1]) { return false; }
        tokenInfo[1] = true;
        return true;
    }

    getRandomToken() {
        var tokenElements = [];
        for (var i = 0; i < 3; i++) {
            tokenElements.push(this.utils.getRandomString(5));
        }
        return tokenElements.join('-');
    }
}

module.exports = TokenManager;