exports.makeIsAuthorized = ({ objectsTbl })=>{
    return async function(o_id, u_id){
        let result = await objectsTbl.isAuthorized(o_id, u_id)


        if(!result.length > 0){
            throw('Unauthorized Deletion')
        }

        return result[0]
    }
}