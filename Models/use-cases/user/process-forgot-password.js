const { makeUser } = require('../../entities')

exports.makeProcessForgotPassword = function ({ usersTbl, sendOtp }){
    return async function processForgotPassword(mobile_no){
        let result = await usersTbl.findByMobileNo(mobile_no)
        if(!result.length > 0){
            throw('User not found')    
        }
        const user = makeUser(result[0])
        let u_id = user.getUid();
        await sendOtp(u_id)
        return u_id
    }
}