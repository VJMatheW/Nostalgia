exports.buildLinkSharingAuth = ()=>{
    return function({
        share_auth_id,
        share_id,
        requester_id,
        status,
        created_on
    }={}){
        if(!share_id){
            throw('Share ID must present')
        }

        if(!requester_id){
            throw('Requester must present')
        }

        return Object.freeze({
            getAuthId: ()=> share_auth_id,
            getShareId: ()=> share_id,
            getEncShareId: ()=> Buffer.from(share_id+'').toString('base64'),
            getRequesterId: ()=> requester_id,
            getStatus: ()=> status,
            getCreatedOn: ()=> created_on
        })
    }
}