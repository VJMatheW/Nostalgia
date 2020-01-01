exports.makeConfirmLinkSharingRequest = ({ linkSharingAuthTbl, NotificationService })=>{
    return async function(share_auth_id){
        let result = await linkSharingAuthTbl.update({
            'share_auth_id': share_auth_id,
            'status': true
        })
        // send notification to requester here along with link 
        return result;
    }
}