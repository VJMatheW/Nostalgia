const { makeLinkSharing } = require('../../entities')

exports.makeAddLinkSharing = ({ objectsTbl, linkSharingTbl })=>{
    return async function(o_id, owner_id){        
        let linkSharing = makeLinkSharing({ o_id, owner_id })

        let share_id;
        let result = await linkSharingTbl.isExists(linkSharing.getOId(), linkSharing.getOwnerId())
        console.log(result)
        if(!result){ // when it is not exists add new row and get share_id
            share_id = await linkSharingTbl.insert(linkSharing.getOId(), linkSharing.getOwnerId())
        }else{ // else get share_id from the existing row
            share_id = result.share_id
        }

        return share_id
    }
}