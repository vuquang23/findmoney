const { queryNative, query20 } = require("./query")
const { magicGenerate } = require('./generate')
const { senddiscord, discordSetup } = require('../send') 

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function produce(product) {
    while (true) {
        product.push(magicGenerate())
        console.log(`Now produce: ${product.length}`)
        await sleep(1300)
    }
}

async function givememoney(product) {
    const channel = await discordSetup()

    while (true) {
        if (product.length) {
            console.log('givememoney...')
            const acc = product.shift() // pubk, prik

            let promises = [
                queryNative(acc.pubk),
                ...query20(acc.pubk)
            ]
            Promise.all(promises)
            .then(result => {
                for (let e of result) {
                    if (!e.ok) {
                        console.log("Found nothing :(")
                        continue
                    }
                    
                    console.log('Found somthing great!')
                    senddiscord(channel, {
                        pubk: acc.pubk,
                        prik: acc.prik,
                        native: e.native,
                        balnce: e.result
                    })
                }
            })
            .catch(err => console.log(`Error in givememoney: ${err.message}`))
        }

        await sleep(1000)
    }
}

async function run() {
    let product = []
    produce(product)
    givememoney(product)
}

module.exports = { run }