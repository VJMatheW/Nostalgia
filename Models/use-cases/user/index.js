const { usersTbl } = require('../../data-access')
const { NotificationService } = require('../../../Components')

const { makeAddUser } = require('./add-user')
const { makeUpdateUser } = require('./update-user')
const { makeSendOtp } = require('./send-otp')
const { makeValidateOtp } = require('./validate-otp')
const { makeValidateUserByMobile } = require('./validate-user-by-mobile')
const { makeValidateUserByEmail } = require('./validate-user-by-email')

const addUser = makeAddUser({ usersTbl })
const updateUser = makeUpdateUser({ usersTbl })
const sendOtp = makeSendOtp({ usersTbl, NotificationService })
const validateOtp = makeValidateOtp({ usersTbl })
const validateUserByMobile = makeValidateUserByMobile({ usersTbl })
const validateUserByEmail = makeValidateUserByEmail({ usersTbl, addUser })

const userService = Object.freeze({
    addUser,
    updateUser,
    sendOtp,
    validateOtp,
    validateUserByMobile,
    validateUserByEmail
})

module.exports = userService