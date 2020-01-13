const { makeUser } = require('../../entities')

exports.makeConfirmLinkSharingRequest = ({ linkSharingAuthTbl, NotificationService })=>{
    return async function(share_auth_id){
        console.log(share_auth_id)
        // let obj = await linkSharingAuthTbl.getInfoByShareAuthId(share_auth_id)        
        // console.log(obj)
        // if(obj.length > 0){
        //     let info = obj[0]
        //     let requesterInfo = makeUser(info)
        //     let text = `Hey ${requesterInfo.getName()}, Your collaboration request for ${info.album_name.toUpperCase()} album had been accepted by ${info.owner_name.toUpperCase()}. Visit ${process.env.FRONT_END_URL} to view & collaborate.`;
        //     if(requesterInfo.getMobile()){
        //         NotificationService.sendSMS(requesterInfo.getMobile(), text)
        //     }
        //     if(requesterInfo.getEmail()){
        //         let subject = "Acceptance of Collaboration request"
        //         NotificationService.sendEmail(requesterInfo.getEmail(), subject, text)
        //     }

        // }

        let result = await linkSharingAuthTbl.update({
            'share_auth_id': share_auth_id,
            'status': true
        })
        // send notification to requester here along with link 
        return result;
    }
}