import fs from 'fs'

class utility {
    constructor() {
        this.blacklisted = []
        fs.readFile("./blacklist.txt", 'utf8', (err, data) => {
            // console.log(err)
            // console.log(data)
            this.blacklisted = JSON.parse(data)
        })
    }
}

/* eslint-disable */
(async function () {
})()

export default utility