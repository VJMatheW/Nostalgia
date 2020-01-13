const { makeUser } = require('../../entities')

exports.makeSetNewPassword = ({ usersTbl })=>{
    return async function setNewPassword(u_id, new_password, otp){
        let result = await usersTbl.findByUid(u_id)

        if(!result.length > 0){
            throw('Unprocessable Entity')
        }
        let user = makeUser(result[0])

        if(Date.now() >= user.getOtpExpiration()){
            throw('OTP expired')
        }
        
        if(user.getOtp() != otp){
            throw('OTP does not match')
        }

        user.setPassword(new_password)
        user.setHashedPassword()

        await usersTbl.update({
            u_id: user.getUid(),
            password: user.getPassword()
        })

        return true
    }
}