const rawdata = require('../rawdata.json')
const filter = require('../filtereddata.json')

var fs = require('fs')

async function main() {
    const obj = {
        "addr20": []
    }

    // // const arr = rawdata["tokens"]

    // // for (let i = 0; i < arr.length; i++) {
    // //     obj["addr20"].push(arr[i]["address"])
    // // }

    const mapping = {}

    for (let a of filter["addr20"]) {
        if (mapping[a]) {
            continue
        }
        mapping[a] = true
        obj["addr20"].push(a)
    }

    console.log(obj["addr20"].length)

    const json = JSON.stringify(obj)
    fs.writeFile('filtereddata.json', json, 'utf8', () => {
        console.log("Done")
    })



}

main()