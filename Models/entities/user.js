exports.buildUser= function({ md5, sanitize }){
    return function user({
        u_id,
        u_name,
        mobile_no,
        email_id,
        password,
        otp,
        otp_expiration,
        otp_verified=false,
        last_signin = Date.now()
    } = {}){
        
        if(!u_name){
            throw('UserName should be present')
        }
        
        if(!mobile_no && !email_id){
            throw('Either Mobile Number or Email Id should be present')
        }
        
        let userInputted = {}
        if(u_name){
            userInputted['u_name'] = u_name
        }

        if(password){
            userInputted['password'] = password
        }
        
        if(mobile_no){
            userInputted['mobile'] = mobile_no
        }

        if(!u_id){
            let error = sanitize(userInputted); 
            if(error.length > 0){
                throw (error);
            }
        }                   

        return Object.freeze({
            getUid: ()=> u_id,
            getName: ()=> u_name,
            getMobile: ()=> mobile_no,
            getEmail: ()=> email_id,
            getPassword: ()=> password,
            setPassword: (new_password)=>{
                password = new_password
            },
            setHashedPassword: ()=> {
                if(password && password.length > 0){
                    password = makeHash(password)
                }               
            },
            getOtp: ()=> (otp || generateOtp()),
            setOtp: ()=> { otp = generateOtp() },
            getOtpExpiration: ()=> Math.floor(otp_expiration),
            getOtpVerified: ()=> otp_verified,
            getLastSignin: ()=> last_signin,
            setOtpVerified: ()=> setOtpVerified()
        })

        function generateOtp(){
            otp_expiration = setOTPExpiration()
            return Math.floor(100000 + (Math.random()*900000));

        }

        function setOTPExpiration(){
            return Date.now() + 1800000 // 30 min 
        }

        function makeHash(){
            return md5(password);
        }

        function setOtpVerified(){
            otp_verified = true
        }
    }
}