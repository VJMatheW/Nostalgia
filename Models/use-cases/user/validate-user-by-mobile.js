const { makeUser } = require('../../entities')

exports.makeValidateUserByMobile = ({ usersTbl })=>{
    return async function validateUserByMobile(mobile_no, password){
        let result = await usersTbl.findByMobileNo( mobile_no )
        if(!result.length > 0){
            throw('User not found')
        }
        
        const user = makeUser(result[0])
        
        if(!user.getOtpVerified()){
            throw('OTP not verified')
        }

        const temp = makeUser({ 'u_name': 'test', 'mobile_no': mobile_no, 'password': password })
        temp.setHashedPassword();
        
        if(user.getPassword() != temp.getPassword()){
            throw('Invalid Mobile number / Password')
        }

        let obj = {
            'u_id': user.getUid(),
            'u_name': user.getName()
        }

        return obj
    }
}