const { makeUser } = require('../../entities')

exports.makeSendOtp = function({ usersTbl, NotificationService }){
    return async function sendOtp( u_id ){
        let result = await usersTbl.findByUid(u_id)
        if(!result.length > 0){
            throw('User not found')
        }
        const user = makeUser(result[0])
        // console.log(user)
        console.log("Checking date ")
        if(Date.now() >= user.getOtpExpiration()){ // check if existing otp expired or not 
            user.setOtp()                          // setting new otp if it is expired
        }

        let obj = {
            u_name: user.getName(),
            mobile_no: user.getMobile(),
            email_id: user.getEmail(),
            password: user.getPassword(),
            otp: user.getOtp(),
            otp_expiration: user.getOtpExpiration(),
            otp_verified: user.getOtpVerified()
        }

        console.log(obj)
        console.log('Expire By : ',new Date(user.getOtpExpiration()).toLocaleString())
        let text = `Hello ${user.getName()}, Your OTP for getnostalgic.com is ${user.getOtp()} which expires by ${ new Date(user.getOtpExpiration()).toLocaleString() }`
        let res = await NotificationService.sendSMS(user.getMobile(), text)

        console.log('SendOTP : ',user)
        
        await usersTbl.update({
            u_id: user.getUid(),
            otp: user.getOtp(),
            otp_expiration: user.getOtpExpiration()
        })

        return res
    }
}