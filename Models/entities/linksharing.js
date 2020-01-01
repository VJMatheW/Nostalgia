exports.buildLinkSharing = ()=>{
    return function({
        share_id,
        o_id,
        owner_id,
        created_on
    }={}){
        
        if(!o_id){
            throw('Object must present')
        }

        if(!owner_id){
            throw('Owner must present')
        }

        return Object.freeze({
            getShareId: ()=> share_id,
            getEncShareId: ()=> Buffer.from(share_id).toString('base64'),
            getOId: ()=> o_id,
            getEncOId: ()=> Buffer.from(o_id).toString('base64'),
            getOwnerId: ()=> owner_id,
            getCreatedOn: ()=> created_on
        })

    }
}