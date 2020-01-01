const nodemailer = require('nodemailer')

exports.sendEmail = function( to, subject, body ){
    return new Promise((resolve, reject)=>{
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_ID,
            to: to,
            subject: subject,
            html: body
        };

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                reject(err)
            }
            resolve(info)
        })
    })
}