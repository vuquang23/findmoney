const crypto = require('crypto')
const random = require('random')
const Chance = require('chance');
const { Random } = require('random-js')
const math = require('mathjs');
const { Wallet } = require('ethers');

const MAX = 9007199254740991
const MIN = 1

// [MIN, MAX]
const Generator = [
    (min, max) => {
        return crypto.randomInt(MIN, 1 << 48)
    }, 
    (min, max) => {
        return random.int(min, max)
    },
    (min, max) => {
        return (new Chance()).integer({ min, max })
    },
    (min, max) => {
        return (new Random()).integer(min, max + 1)
    },
    (min, max) => {
        return math.randomInt(min, max + 1)
    }
]

function Mod16(num) {
    return num % 16
}

function genNum(Mod) {
    let ret = Generator.reduce((prv, func) => {
        prv = Mod(prv*Mod(func(MIN, MAX)) + func(MIN, MAX))
        return prv
    }, 1)

    let nBlending = crypto.randomInt(6, 19)
    for (let i = 0; i < nBlending; i++) {
        let func = Generator[math.pickRandom([1, 0, 2, 4, 3])]
        ret = Mod(ret*Mod(func(MIN, MAX)) + func(MIN, MAX))
    }

    return ret
}

function magicGenerate() { // {pubk, prik}
    const N = 64
    let ret = ''
    for (let i = 0; i < N; ++i) {
        const number = genNum(Mod16)
        ret += number.toString(16)
    }
    let silver = new Wallet(ret)
    return {
        pubk: silver.address,
        prik: ret
    }
}

module.exports = { magicGenerate, genNum }