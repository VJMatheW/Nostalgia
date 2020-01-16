const { makeLinkSharingAuth } = require('../../entities')

exports.makeAddLinkSharingRequest = ({ linkSharingTbl, linkSharingAuthTbl, NotificationService })=>{
    return async function(share_id, requester_id){
        let linkSharingAuth = makeLinkSharingAuth({ share_id, requester_id })
        let obj = {};
        let result = await linkSharingAuthTbl.isExists(linkSharingAuth.getShareId(), linkSharingAuth.getRequesterId())
        console.log("linksharingauth RESULT : ", result)
        if(!result){ // insert new record
            obj['isnew'] = true
            obj['status'] = null
            obj['share_auth_id'] = await linkSharingAuthTbl.insert(linkSharingAuth.getShareId(), linkSharingAuth.getRequesterId())
        }else{
            obj['isnew'] = false;
            obj['share_auth_id'] = result.share_auth_id
            if(result.status){ // if true that is if already accepted 
                // redirect to home page
                obj['status'] = true
            }else{
                obj['status'] = false
            }
        }

        // send notification in sms or email based on share_id and owner_id
        let result2 = await linkSharingTbl.getAllById(share_id, requester_id)
        
        if(!result2.length > 0){
            throw('Share request not found')
        }

        let row = result2[0]
        obj['o_name'] = row.name
        obj['u_name'] = row.u_name
        obj['o_id'] = row.o_id
        
        if(obj['status'] == null){ // which means 1st time new record is inserted || user accessing sharing link 1st time
            let unique = Buffer.from(obj.share_auth_id+'').toString('base64')
            let txt = `Hi ${row.u_name}, ${row.requester_name} wants to collaborate for ${row.name} album with you. To collaborate ${process.env.FRONT_END_URL}/auth?o=${unique}`
            
            if(row.mobile_no){
                // u_id, u_name, mobile_no, email_id, o_id, name, requester_name                
                
                // send msg notification
                console.log('sending SMS Notification')
                NotificationService.sendSMS(row.mobile_no, txt)
            }

            if(row.email_id){
                // send email notification 
                console.log('Sending Email')
                let subject = `${row.requester_name} wants to see ${row.name} album`
                NotificationService.sendEmail(row.email_id, subject, txt)
            }
        }

        return obj;
    }
}