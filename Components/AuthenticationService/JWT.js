const jwt = require('jsonwebtoken')

const SECRET_KEY_PRIVATE = 'helloworld'
const SECRET_KEY_PUBLIC = 'helloworld'

const issuer = 'ARME Dev Center'
const audience = 'http://getnostalgic.com'
const expiresIn = '3d'

let signOptions = {
    'issuer': issuer,
    'audience': audience,
    'expiresIn': expiresIn,
    // 'algorithm': 'RS256' // enable this when you use public and private key or use any other asymmetric algo
}


let sign = (payload)=>{
    // signOptions.subject = clientUnique
    return jwt.sign(payload, SECRET_KEY_PRIVATE, signOptions)
}

let verify = (token)=>{
    try{
        // signOptions.subject = clientUnique
        return jwt.verify(token, SECRET_KEY_PUBLIC, signOptions)
    }catch(err){
        return false
    }
}

let decode = (token)=>{
    return jwt.decode(token, {complete: true});
}

module.exports = {
    'sign': sign,
    'verify': verify,
    'decode': decode
}