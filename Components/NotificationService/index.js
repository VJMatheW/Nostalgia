const { sendSMS } = require('./SMSService')
const { sendEmail } = require('./EmailService')

const notifyService = Object.freeze({
    sendSMS,
    sendEmail
})

module.exports = notifyService
// export { sendSMS, sendEmail } 

