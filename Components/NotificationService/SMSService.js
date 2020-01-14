const { HttpService } = require('../')

exports.sendSMS = function( mobile_no, text ){
    return new Promise((resolve, reject)=>{
        try{
            HttpService.get(`${process.env.SMS_HOST}/api/mt/SendSMS?user=${process.env.SMS_USER_NAME}&password=${process.env.SMS_USER_PASSWORD}&senderid=${process.env.SMS_SENDER_ID}&channel=Trans&DCS=0&flashsms=0&number=91${mobile_no}&text=${encodeURI(text)}&route=4`
                ,(res)=>{
                    res = JSON.parse(res)
                    console.log('error code : ',res.ErrorCode);
                    console.log("Sending SMS to ", mobile_no)
                    console.log(`Message : ${ text }`)
                    // resolve({mobile_no, text})
                    // let res = {"ErrorCode":"000","ErrorMessage":"Done","JobId":"167610","MessageData":[{"Number":"919042307071","MessageId":"g7WKy4mi8ki3e11DXj1SNA"}]}
                    resolve(res)
            })
        }catch(err){
            reject(err)
        }    
    })    
}