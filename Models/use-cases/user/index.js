const { usersTbl } = require('../../data-access')
const { NotificationService } = require('../../../Components')

const { makeAddUser } = require('./add-user')
const { makeUpdateUser } = require('./update-user')
const { makeSendOtp } = require('./send-otp')
const { makeValidateOtp } = require('./validate-otp')
const { makeValidateUserByMobile } = require('./validate-user-by-mobile')
const { makeValidateUserByEmail } = require('./validate-user-by-email')
const { makeProcessForgotPassword } = require('./process-forgot-password')
const { makeSetNewPassword } = require('./set-new-password')

const addUser = makeAddUser({ usersTbl })
const updateUser = makeUpdateUser({ usersTbl })
const sendOtp = makeSendOtp({ usersTbl, NotificationService })
const validateOtp = makeValidateOtp({ usersTbl })
const validateUserByMobile = makeValidateUserByMobile({ usersTbl })
const validateUserByEmail = makeValidateUserByEmail({ usersTbl, addUser })
const processForgotPassword = makeProcessForgotPassword({ usersTbl, sendOtp })
const setNewPassword = makeSetNewPassword({ usersTbl })

const userService = Object.freeze({
    addUser,
    updateUser,
    sendOtp,
    validateOtp,
    validateUserByMobile,
    validateUserByEmail,
    processForgotPassword,
    setNewPassword
})

module.exports = userService