const Colors = require("../colors");
const language = require("../language.json");
const colors = new Colors();

class LangManager {
    constructor(configScope) {
        this.lang = language;
        this.langConfigScope = this.lang[configScope];
        console.log(colors.changeColor("blue", "Registered scope " + configScope + " in language manager"))
    }

    getString(key, ...values) {
        var langString = "";
        if (this.langConfigScope[key]) {
            langString = this.langConfigScope[key];
            var regexIterator = langString.matchAll('\{(.*?)\}');
            if (regexIterator.length < values.length) { console.log("MISMATCHED VALUES"); return; }
            for (var elem of regexIterator) langString = this.replaceString(langString, elem[0], values[Number(elem[1])]);
        } else {
            console.log(colors.changeColor("red", "Can't fint string for identifier " + key));
            langString = key;
        }
        return langString;
    }

    replaceString(string, key, value) {
        return string.substring(0, string.indexOf(key)) + value + string.substring(string.indexOf(key) + key.length, string.length);
    }
}

module.exports = LangManager