const ethers = require('ethers')
const data = require('../data/data.json')

const MAINNET = 'https://bsc-dataseed.binance.org/'
const TESTNET = 'https://data-seed-prebsc-1-s1.binance.org:8545/'

const PROVIDERS = new ethers.providers.JsonRpcProvider(TESTNET)
const ABI = [
    "function balanceOf(address) view returns (uint)"
]

function queryNative(addr) {
    console.log(`Query native for ${addr}`)
    return PROVIDERS.getBalance(addr)
            .then(result => {
                const ok = !result.isZero()
                return {
                    ok: ok,
                    native: "0x0",
                    result: result.toString()
                }
            })
            .catch(err => {
                console.log(`Error when query native: ${err.message}`)
                return {
                    ok: false
                }
            })
}

function query20(addr) {
    let promises = []
    for(let e of data.addr20) {
        console.log(`Query 20 for ${addr}`)
        const contract = new ethers.Contract(e, ABI, PROVIDERS)
        let mypromise = contract.balanceOf(addr)
            .then(result => {
                const ok = !result.isZero()
                return {
                    ok: ok,
                    native: e,
                    result: result.toString()
                }
            })
            .catch(err => {
                console.log(`Error when query native: ${err.message}`)
                return {
                    ok: false
                }
            })

        promises.push(mypromise)
    }
    return promises
}

module.exports = {
    queryNative,
    query20
}