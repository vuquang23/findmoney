const { queryNative, query20 } = require("./query")
const sendmail = require('../sendmail')
const { magicGenerate } = require('./generate')

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

async function produce(product) {
    while (true) {
        product.push(magicGenerate())
        console.log(`Now produce: ${product.length}`)
        await sleep(500)
    }
}

async function givememoney(product) {
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
                        continue
                    }
                    
                    console.log('Found somthing great!')
                    sendmail.send({
                        pubk: acc.pubk,
                        prik: acc.prik,
                        native: e.native,
                        balnce: e.result
                    })
                }
            })
            .catch(err => console.log(err))
        }

        await sleep(300)
    }
}

async function run() {
    let product = []
    produce(product)
    givememoney(product)
}

module.exports = { run }