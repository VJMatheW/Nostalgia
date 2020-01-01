function isMobileNo(str){
    if(str && str.match(/^\d{10}$/)){
        return true;
    }else{
        return false;
    }
}

function isPassword(str){
    if(str && str.match(/^[A-Za-z0-9_]\w{7,14}$/)){
        return true;
    }else{
        return false;
    }
}

function isText(str){
    console.log("ISTEXT STR -------- ",str)
    if(str && str.match(/^[A-Za-z\ ]+$/)){
        return true;
    }else{
        return false;
    }
}

function isOtp(str){
    if(str && str.match(/^\d{6}$/)){
        return true;
    }else{
        return false;
    }
}

function sanitize(obj){    
    let error = [];
    for (let [key, value] of Object.entries(obj)) {
        switch(key){
            case 'mobile_no':
                if(!isMobileNo(obj[key])){
                    error.push('Mobile No should be of 10 digits');
                }
                break;
            case 'password':                
                if(!isPassword(obj[key])){
                    error.push('Password should be between 7 to 16 characters which contain only characters, numeric digits and underscore');
                }
                break;
            case 'password1':
                if(!isPassword(obj[key])){
                    if(obj[key] !== obj['password']){
                        error.push('Passwords do not match');
                    }
                }
            case 'u_name':
                if(!isText(obj[key])){
                    error.push('Name can contain only Alphabetic characters');                    
                }
                break;
            case 'otp':
                if(!isOtp(obj[key])){
                    error.push('OTP not so good !!!')
                }
            default: 
                console.log("Nothing found");
                break;
        }
    }
    return error;
}

function makeHash(text){
    const crypto = require('crypto');
    return crypto
        .createHash('md5')
        .update(text, 'utf-8')
        .digest('hex')
}

module.exports = {
    'sanitize': sanitize,
    'makeHash': makeHash
}