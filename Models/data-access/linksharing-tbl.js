exports.makeLinkSharingTbl = function({ db }){
    return Object.freeze({
        getById,
        getAllById,
        isExists,
        insert
    })

    function getById(share_id){
        let query = 'select * from linksharing where share_id=?'
        return db.get(query, [share_id])
    }

    function getAllById(share_id, requester_id){
        let query = `select u.u_id, u.u_name, u.mobile_no, u.email_id, o.o_id, name, ut.u_name as requester_name from users as u 
            inner join objects as o on u.u_id=o.created_by
            inner join linksharing as ls on o.o_id=ls.o_id
            left join linksharingauth as lsa on ls.share_id=lsa.share_id
            left join users as ut on lsa.requester_id=ut.u_id
            where ls.share_id=? and requester_id=?`
        return db.get(query, [share_id, requester_id])
    }

    async function isExists(o_id, owner_id){
        let query = 'select * from linksharing where o_id=? and owner_id=?'
        let result = await db.get(query, [o_id, owner_id])
        if(!result.length > 0){
            return false
        }
        return result[0]
    }

    function insert(o_id, owner_id){
        let query = 'insert into linksharing (o_id,owner_id) values(?,?)'
        return db.run(query, [o_id, owner_id])
    }
}