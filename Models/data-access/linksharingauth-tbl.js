exports.makeLinkSharingAuthTbl = function({ db }){
    return Object.freeze({
        getById,
        isExists,
        insert,
        update
    })

    function getById(share_auth_id){
        let query = 'select * from linksharingauth where share_auth_id=?'
        return db.get(query, [share_auth_id])
    }

    async function isExists(share_id, requester_id){
        let query = 'select * from linksharingauth where share_id=? and requester_id=?'
        let result = await db.get(query, [share_id, requester_id])
        if(result.length > 0){
            return result[0]
        }
        return false
    }

    function insert(share_id, requester_id){
        let query = 'insert into linksharingauth(share_id, requester_id) values(?,?)'
        return db.run(query, [share_id, requester_id])
    }

    function update(shareAuthUpdateInfo){
        let query = ''
        let params = [] 
        for(let [key, value] of Object.entries(shareAuthUpdateInfo)){
            if(key !== 'share_auth_id'){
                query += key+'=?,'
                params.push(value)
            }
        }
        query = query.substring(0, query.length - 1)
        query = 'update linksharingauth set '+query+' where share_auth_id='+shareAuthUpdateInfo.share_auth_id
        
        console.log(query)
        return db.run(query, params)
    }
}