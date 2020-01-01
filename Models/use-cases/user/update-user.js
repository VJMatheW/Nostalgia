const { makeUser } = require('../../entities')

exports.makeUpdateUser = function({ usersTbl }){
    return async function updateUser( userInfo ){
        const user = makeUser(userInfo);
        console.log(user)

        return usersTbl.update({
            u_name: user.getName(),
            mobile_no: user.getMobile(),
            email_id: user.getEmail(),
            password: user.getPassword(),
            otp_verified: user.getOtpVerified()          
        })        
    }
}