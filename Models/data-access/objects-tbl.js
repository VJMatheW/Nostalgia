exports.makeObjectsTbl = function({ db }){
    return Object.freeze({
        getById,
        getForUser,
        getHomeForUser,
        isAuthorized,
        insert,
        update,
        deleteById
    })

    function getById(o_id){
        let query = 'select * from objects where o_id=?'
        return db.get(query, [o_id])
    }

    function getForUser(u_id, parent_id){
        let query = 'select * from objects where parent_id=? order by digitized_date asc'; // and created_by=?'
        // console.log(`'select * from objects where parent_id=${parent_id} and created_by=${u_id}`)
        return db.get(query, [parent_id])
    }

    function getHomeForUser(u_id, parent_id){
        // let query = 'select * from objects where parent_id=? and created_by=?'
        let query = 'select o.o_id, o.name, o.parent_id, o.o_type, o.created_by from objects as o left join linksharing as ls on o.o_id=ls.o_id left join linksharingauth as lsa on ls.share_id=lsa.share_id where (o.parent_id=? and o.created_by=?) or (lsa.requester_id=? and lsa.status=true) group by o.o_id'
        // console.log(`'select * from objects where parent_id=${parent_id} and created_by=${u_id}`)
        return db.get(query, [parent_id, u_id, u_id])
    }

    function isAuthorized(o_id, u_id){
        let query = 'select o.o_id, name, created_by, ls.o_id as ls_o_id, owner_id, lsa.share_id, requester_id from objects as o left join linksharing as ls on o.o_id=ls.o_id left join linksharingauth as lsa on ls.share_id=lsa.share_id where (o.o_id=? and o.created_by=?) or (ls.o_id=? and lsa.requester_id=? and status=true)';
        return db.get(query, [o_id, u_id, o_id, u_id])
    }

    function insert(objectInfo){        
        let query = 'insert into objects(name, v_name, parent_id, o_type, created_by) values (?,?,?,?,?)'
        let params = [objectInfo.name, objectInfo.v_name, objectInfo.parent_id, objectInfo.o_type, objectInfo.created_by]
        return db.run(query, params)
    }

    function update(objectInfo){
        let query = ''
        let params = [] 
        for(let [key, value] of Object.entries(objectInfo)){
            if(key !== 'o_id'){
                query += key+'=?,'
                params.push(value)
            }
        }
        query = query.substring(0, query.length - 1)
        query = 'update objects set '+query+' where o_id='+objectInfo.o_id

        // console.log(query)
        return db.run(query, params)
    }

    function deleteById(o_id){
        let query = 'delete from objects where o_id=?'
        return db.run(query, [o_id])
    }
}