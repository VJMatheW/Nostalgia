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
                res.sendStatus(401).json({'error': 'Something went wrong'}); // unauthorized
                return;
            }
        } 

        let email_id = payload.email;
        let u_name = payload.name;
        // let picUrl = payload.picture;

        let obj = await UserService.validateUserByEmail(email_id, u_name)        
        let token = AuthenticationService.jwt.sign({'u_id': obj.u_id}, clientId+"")
        res.status(201).json({ 'status': true, 'token': token, 'clientId': clientId, 'uid': obj.u_id, 'u_name': obj.u_name })
        
    }else{
        // signin with mobile number
        try{
            let obj = await UserService.validateUserByMobile(mobile_no, password)
            let token = AuthenticationService.jwt.sign({'u_id': obj.u_id}, clientId+"")
            res.status(201).json({ 'status': true, 'token': token, 'clientId': clientId, 'uid': obj.u_id, 'u_name': obj.u_name })  
        }catch(err){
            console.log(err)
            if(err.startsWith('OTP')){
                res.status(503).json({'error': err})
                return;
            }
            res.status(401).json({'error': err})
        }
    }
})

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

router.post('/otp', async (req, res)=>{
    let u_id = req.body.u_id
    let otp = req.body.otp
    let clientId = req.body.clientId

    try{
        let status = await UserService.validateOtp(u_id, otp)

        // generate the token and send it to store in local storage
        let token = AuthenticationService.jwt.sign({'u_id': u_id}, clientId+"")

        res.status(201).json({ 'status': true, 'token': token, 'clientId': clientId, 'uid': u_id })  
    }catch(err){
        res.status(401).json({'error': err})
        return;
    }
})

module.exports = router;

// functions

