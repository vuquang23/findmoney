const ethers = require('ethers')
const data = require('../data/data.json')
const { genNum } = require('./generate')

const MAINNET = 'https://bsc-dataseed1.defibit.io/'
const TESTNET = 'https://data-seed-prebsc-1-s1.binance.org:8545/'

const PROVIDERS = new ethers.providers.JsonRpcProvider(MAINNET)
const ABI = [
    "function balanceOf(address account) external view returns (uint256)"
]

function queryNative(addr) {
    console.log(`# Query native for ${addr}`)
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

const modFunc = (mod) => {
    return function (num) {
        return num % mod
    }
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

const SIZE = data["addr20"].length
const BATCH = 500

async function query20(addr) {
    let promises = []
    // SIZE / BATCH = 2
    for(let start = 0; start < SIZE; start += BATCH) {
        for(let i = start; i < Math.min(start + BATCH, SIZE); i++) {
            const e = data["addr20"][i]
            console.log(`#${i} ~ Query 20: ${e} ~ for: ${addr}`)
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
                console.log(`Error when query 20: ${err.message}`)
                return {
                    ok: false
                }
            })
            promises.push(mypromise)
        }
        await sleep(5000)
    }
    
    return promises
}

module.exports = {
    queryNative,
    query20,
    sleep
}