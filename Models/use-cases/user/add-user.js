const { makeUser } = require('../../entities')

exports.makeAddUser = function({ usersTbl }){
    return async function addUser( userInfo ){
        const user = makeUser(userInfo);
        console.log(user)

        if(user.getMobile()){
            let exists = await usersTbl.findByMobileNo(user.getMobile());
            if(exists.length > 0){
                throw('Mobile number already registerd ')
            }
        }

        if(user.getEmail()){
            let exists = await usersTbl.findByEmail(user.getEmail());
            if(exists.length > 0){
                throw('Email-Id already registerd ')
            }
        }        

        user.setHashedPassword() // to make password = hashed password

        return usersTbl.insert({
            u_name: user.getName(),
            mobile_no: user.getMobile(),
            email_id: user.getEmail(),
            password: user.getPassword(),
            otp: user.getOtp(),
            otp_expiration: user.getOtpExpiration(),
            otp_verified: user.getOtpVerified()
        })

        // checks if mobile_no already exists

        // checks if email already exists

        // then add the user to database

        
    }
}