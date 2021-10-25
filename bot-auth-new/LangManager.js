const language = require("./language.json");

class LangManager {
    constructor(configScope) {
        this.lang = language;
        this.langConfigScope = this.lang[configScope];
    }

    getString(key, ...values) {
        var langString = this.langConfigScope[key];
        var regexIterator = langString.matchAll('\{(.*?)\}');
        if (regexIterator.length < values.length) { console.log("MISMATCHED VALUES"); return; }
        for (var elem of regexIterator) {
            langString = this.replaceString(langString, elem[0], values[Number(elem[1])]);
        }
        return langString;
    }

    replaceString(string, key, value) {
        return string.substring(0, string.indexOf(key)) + value + string.substring(string.indexOf(key) + key.length, string.length);
    }
}

module.exports = LangManager