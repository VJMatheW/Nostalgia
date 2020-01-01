const { makeUser } = require('../../entities')

exports.makeValidateOtp = ({ usersTbl })=>{
    return async function validateOtp(u_id, user_otp){
        console.log(u_id, user_otp)
        let result = await usersTbl.findByUid(u_id)

        if(!result.length > 0){
            throw('User not found')
        }
        
        const user = makeUser(result[0])
        console.log(result[0])
        if(Date.now() >= user.getOtpExpiration()){ // check if existing otp expired or not 
            throw('OTP expired');
        }

        console.log('Dotp : ',user.getOtp(), ' Uotp : ', user_otp)

        if(user.getOtp() != user_otp){ // otp does not match
            throw('OTP does not match')
        }

        usersTbl.update({ otp_verified: true, 'u_id':u_id })

        return true
    }
}