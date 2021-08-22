const Discord = require('discord.js');
const { start } = require('repl');
var config = require('./config.json');

const fusoOrario = config.fusoOrario

class Utils {
  constructor() { }

  updateField(array, field, value) {
    array.forEach((elem) => {
      if (elem.name === field) {
        elem.value = value
      }
    })
    return array;
  }

  getFieldValue(array, field) {
    for (var elem of array) {
      if (elem[field] != undefined) {
        return elem.value
      }
    }
  }
  getField(array, targetElemID, field) {
    for (var elem of array) {
      if (elem.id == targetElemID && elem[field] != undefined) {
        return elem[field]
      }
    }
  }

  isInServizio(arrayInServizio, id) {
    for (var elem of arrayInServizio) {
      if (elem.id === id) {
        return true;
      }
    }
    return false;
  }

  removeElemAtIndex(array, index) {
    var tempArray = []

    for (var elem of array) {
      if (array.indexOf(elem) !== index) {
        tempArray.push(elem)
      }
    }

    return tempArray;
  }

  updateGradiInServizio(arrayInServizio, utente, add, logChannel) {
    if (add) {
      arrayInServizio.push({ username: utente.username, id: utente.id, timestamp: Date.now() })
    } else {
      for (var elem of arrayInServizio) {
        if (elem.id == utente.id) {
          this.logBadgeOut({ username: '<@' + utente.id + '>', timestamp: { enter: elem.timestamp, exit: Date.now() }, channel: logChannel })
          arrayInServizio.splice(arrayInServizio.indexOf(elem), 1)
          break;
        }
      }
    }
  }

  updateEmbedFields(badgeGuildRoles, guildRoles, message) {
    badgeGuildRoles.sort((firstRole, secondRole) => guildRoles.get(secondRole.id).rawPosition - guildRoles.get(firstRole.id).rawPosition);
        
    message.embeds[0].fields = [];
    badgeGuildRoles.forEach((ruolo) => {
      message.embeds[0].addFields({ name: ruolo.name, value: this.getInServizioListString(ruolo.inServizio) });
    })
    
    message.edit(message.embeds[0]);
  }

  getInServizioListString(array) {
    var listString = "";
    if (array.length == 0) {
      listString = "Nessuno in servizio"
    } else {
      for (var elem of array) {
        listString += '<@' + elem.id + '>' + ((array.indexOf(elem) !== array.length - 1) ? ", " : "")
      }
    }
    return listString
  }

  getHighestRole(rootRoles, userRoles) {
    for (var currentRole of rootRoles) {
      for (var currentUserRoleID of userRoles) {
        if (currentUserRoleID === currentRole.id) {
          return currentRole.id;
        }
      }
    }
  }

  getRoleNameById(rootRoles, id) {
    for (const role of rootRoles.keys()) {
      if (role === id) {
        return rootRoles.get(role).name
      }
    }
  }

  getRemainingTime(startMillis, stopMillis) {
    var elapsedTime = stopMillis - startMillis;
    // console.log(elapsedTime, stopMillis, startMillis)
    var elapsedTimeFormatted = { hours: 0, minutes: 0, seconds: 0 }
    elapsedTimeFormatted.seconds = Math.floor((elapsedTime / 1000));
    if (elapsedTimeFormatted.seconds > 59) { elapsedTimeFormatted.minutes = Math.floor(elapsedTimeFormatted.seconds / 60); elapsedTimeFormatted.seconds = elapsedTimeFormatted.seconds % 60; }
    if (elapsedTimeFormatted.minutes > 59) { elapsedTimeFormatted.hours = Math.floor(elapsedTimeFormatted.minutes / 60); elapsedTimeFormatted.minutes = elapsedTimeFormatted.minutes % 60; }
    if (elapsedTimeFormatted.hours > 23) { elapsedTimeFormatted.days = Math.floor(elapsedTimeFormatted.hours / 24); elapsedTimeFormatted.hours = elapsedTimeFormatted.hours % 24; }
    elapsedTimeFormatted.hours = elapsedTimeFormatted.hours == 1 ? elapsedTimeFormatted.hours + " Ora " : elapsedTimeFormatted.hours + " Ore "
    elapsedTimeFormatted.minutes = elapsedTimeFormatted.minutes == 1 ? elapsedTimeFormatted.minutes + " Minuto " : elapsedTimeFormatted.minutes + " Minuti "
    elapsedTimeFormatted.seconds = elapsedTimeFormatted.seconds == 1 ? elapsedTimeFormatted.seconds + " Secondo" : elapsedTimeFormatted.seconds + " Secondi"
    return elapsedTimeFormatted.hours + elapsedTimeFormatted.minutes + elapsedTimeFormatted.seconds;
  }

  // colorHex, title, description, thumbnail, timestamp, footer

  defaultEmbedData = {
    thumbnail: "https://cdn.discordapp.com/attachments/858349668197859378/876171558157160478/smurf-funny.gif",
    footer: "Bot fatto da Gasaferic cor core 🥵 🥵 🥵"
  }
  
  getEmbedMessage(embedData) {
    const embedMessage = new Discord.MessageEmbed();
    if (embedData.colorHex) { embedMessage.setColor(embedData.colorHex); }
    if (embedData.title) { embedMessage.setTitle(embedData.title); }
    if (embedData.description) { embedMessage.setDescription(embedData.description); }
    if (embedData.timestamp) { embedMessage.setTimestamp(); }
    embedMessage.setThumbnail(embedData.thumbnail || this.defaultEmbedData.thumbnail);
    embedMessage.setFooter(embedData.footer || this.defaultEmbedData.footer);
    return embedMessage;
  }

  removeEmptyElems(array) {
    var finalArray = [];
    for (var elem of array) {
      if (elem != '') {
        finalArray.push(elem);
      }
    }
    return finalArray;
  }

  containsFieldValue(array, field, value) {
    for (var elem of array) {
      if (elem[field] != undefined && elem[field] == value) {
        return true;
      }
    }
    return false;
  }

  getElemByFieldValue(array, field, value) {
    for (var elem of array) {
      if (elem[field] != undefined && elem[field] == value) {
        return elem;
      }
    }
    return undefined;
  }

  getRoomByUserID(roomChannels, currentServer, userId) {
    var room;
    for (var roomChannel of roomChannels) {
        if (room) { break; }
        for (var permissionOverwrite of currentServer.channels.cache.get(roomChannel).permissionOverwrites.cache.keys()) {
            if (permissionOverwrite == userId) { room = roomChannel; break; }
        }
    }
    return room;
  }

  getRandomString(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  regExpIP = new RegExp(/^((?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])[.]){3}(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/);
  validateIPaddress(ip) {
    return this.regExpIP.test(ip);
  }

}

module.exports = Utils