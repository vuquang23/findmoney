const rawdata = require('../rawdata.json')
var fs = require('fs')

async function main() {
    const obj = {
        "addr20": []
    }

    const arr = rawdata["tokens"]

    for (let i = 0; i < arr.length; i++) {
        obj["addr20"].push(arr[i]["address"])
    }

    const json = JSON.stringify(obj)
    fs.writeFile('filtereddata.json', json, 'utf8', () => {
        console.log("Done")
    })

}

main()