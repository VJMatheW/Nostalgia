const router = require('express').Router();
const { gauth } = require('../Components/AuthenticationService')
const { SanitationService, HttpService, AuthenticationService } = require('../Components')
const { UserService } = require('../Models')

router.post('/signin', async (req, res)=>{
    console.log('signin got hit')
    let { id_token, mobile_no, password, clientId } = req.body;

    if(id_token){
        var payload = await AuthenticationService.gauth.verify(id_token).catch(err=>{ return false; });
        console.log(payload.iss)
        if(!payload || payload.iss !== 'https://accounts.google.com'){ // if error occurs or id_token tampered
            if(!payload || payload.iss !== 'accounts.google.com'){
                res.status(401).json({'error': 'Something went wrong'}); // unauthorized
                return;
            }
        } 

        let email_id = payload.email;
        let u_name = payload.name;
        // let picUrl = payload.picture;

        let obj = await UserService.validateUserByEmail(email_id, u_name)        
        let token = AuthenticationService.jwt.sign({'u_id': obj.u_id})
        res.status(201).json({ 'status': true, 'token': token, 'uid': obj.u_id, 'u_name': obj.u_name })
        
    }else if(mobile_no){
        // signin with mobile number
        try{
            let obj = await UserService.validateUserByMobile(mobile_no, password)
            let token = AuthenticationService.jwt.sign({'u_id': obj.u_id})
            res.status(201).json({ 'status': true, 'token': token, 'uid': obj.u_id, 'u_name': obj.u_name })  
        }catch(err){
            console.log(err)
            if(err.error && err.error.startsWith('OTP')){
                res.status(403).json({'u_id':err.u_id, 'error': err.error})
                return;
            }
            res.status(401).json({'error': err})
        }
    }
})

/**
    Handle public authorization settings
 */
router.get('/public', async (req, res)=>{
    try{
        let token = AuthenticationService.jwt.sign({'u_id': 10000})
        res.status(201).json({ 'status': true, 'token': token, 'uid': 10000, 'u_name': "Public Profile" })  
    }catch(err){
        console.log(err)
        if(err.error && err.error.startsWith('OTP')){
            res.status(403).json({'u_id':err.u_id, 'error': err.error})
            return;
        }
        res.status(401).json({'error': err})
    }
})

/**
    Handles initial signup process
 */
router.post('/signup', async (req, res)=>{
    let data = req.body;
        
    try{
        let u_id = await UserService.addUser(data)
        let otpRes = await UserService.sendOtp(u_id)
        if(otpRes.ErrorCode == 000){
            res.status(201).json({'u_id': u_id, 'otp': otpRes});
        }else{
            res.status(500).json({'error': 'OTP not sent'})
        }
    }catch(err){
        res.status(422).json({'error': err}) // unprocessable entity
        return;
    }    
})

/**
    Handles request to resend otp when otp not verified
 */
router.post('/resendotp', async(req, res)=>{
    let u_id = req.body.u_id
    try{
        let otpRes = await UserService.sendOtp(u_id)
        if(otpRes.ErrorCode == 000){
            res.status(201).json({'u_id': u_id, 'otp': otpRes});
        }else{
            res.status(500).json({'error': 'OTP not sent'})
        }
    }catch(err){
        res.status(422).json({'error': err}) // unprocessable entity
        return;
    }   
})

/**
    Handles validation of otp entered by the user
 */
router.post('/otp', async (req, res)=>{
    let u_id = req.body.u_id
    let otp = req.body.otp

    try{
        let obj = await UserService.validateOtp(u_id, otp)

        // generate the token and send it to store in local storage
        let token = AuthenticationService.jwt.sign({'u_id': u_id})

        res.status(201).json({ 'status': true, 'token': token, 'uid': u_id, 'u_name': obj.u_name })  
    }catch(err){
        res.status(401).json({'error': err})
    }
})

/**
    Handles forgotpass initial
 */
router.post('/forgotpass', async (req, res)=>{
    let validate = req.body.validate
    let mobile_no = req.body.mobile_no

    try{
        let u_id = await UserService.processForgotPassword(mobile_no)
        res.status(201).json({'u_id': u_id})        
    }catch(err){
        res.status(422).json({'error': err})
    }    
})

/**
    Handles setting new password
 */
router.post('/setnewpassword', async (req, res)=>{
    let new_password = req.body.new_password
    let u_id = req.body.u_id
    let otp = req.body.otp

    try{
        let changePassword = await UserService.setNewPassword(u_id, new_password, otp)
        if(changePassword){
            res.status(201).json({'status': true})
        }else{
            res.status(422).json({'error': changePassword})
        }
    }catch(err){
        res.status(422).json({'error': err})
    }
})

module.exports = router;