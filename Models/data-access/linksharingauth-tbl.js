exports.makeLinkSharingAuthTbl = function({ db }){
    return Object.freeze({
        getById,
        getInfoByShareAuthId,
        isExists,
        insert,
        update
    })

    function getById(share_auth_id){
        let query = 'select * from linksharingauth where share_auth_id=?'
        return db.get(query, [share_auth_id])
    }

    function getInfoByShareAuthId(share_auth_id){
        let query = 'select u_name, mobile_no, email_id, o.name as album_name, us.u_name as owner_name from linksharingauth as lsa left join users as u on lsa.requester_id=u.u_id left join linksharing as ls on lsa.share_id=ls.share_id left join objects as o on ls.o_id=o.o_id left join users as us on ls.owner_id=us.u_id where share_auth_id=?'
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