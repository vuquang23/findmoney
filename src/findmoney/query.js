const ethers = require('ethers')
const data = require('../data/data.json')
const { genNum } = require('./generate')

const MAINNET = 'https://bsc-dataseed.binance.org/'
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

const SIZE = data["addr20"].length

function query20(addr) {
    let promises = []
    const chances = 33
    for(let i = 0; i < chances; i++) {
        const e = data["addr20"][genNum(modFunc(SIZE))]
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
    return promises
}

module.exports = {
    queryNative,
    query20
}