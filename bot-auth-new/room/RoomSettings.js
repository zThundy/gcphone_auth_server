class RoomSettings {
    roomSettings = {};

    constructor(roomSettingsString) {
        this.roomSettings = JSON.parse(roomSettingsString || '{"firstIP": {"name": "Senza nome", "ip": "Non impostato"}, "secondIP": {"name": "Non acquistato", "ip": "Non acquistato"}}'); // , "allowedIds": []
    }

    getValue(key) {
        return this.roomSettings[key];
    }

    setValue(key, value) {
        this.roomSettings[key] = value;
    }

    getJSONString() {
        return JSON.stringify(this.roomSettings);
    }
}

module.exports = RoomSettings