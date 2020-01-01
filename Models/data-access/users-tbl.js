exports.makeUsersTbl = function({ db }){
    return Object.freeze({
        findByMobileNo,
        findByEmail,
        findByUid,
        insert,
        update,
        remove
    })

    function findByMobileNo( mobile_no ){
        let query = `select * from users where mobile_no like "${mobile_no}"`
        return db.get(query)
    }

    function findByEmail( email ){
        let query = `select * from users where email_id like "${email}"`
        return db.get(query)
    }

    function findByUid( u_id ){
        let query = 'select * from users where u_id=?'
        return db.get(query, u_id)
    }

    function insert( { ...userInfo } ){
        console.log(userInfo)
        let query = `insert into users(u_name, mobile_no, email_id, password, otp, otp_expiration, otp_verified)values(?,?,?,?,?,?,?)`
        let params = [userInfo.u_name, userInfo.mobile_no, userInfo.email_id, userInfo.password, userInfo.otp, userInfo.otp_expiration, userInfo.otp_verified]
        return db.run(query, params)
    }

    function update( { ...userInfo } ){
        let query = ''
        let params = [] 
        for(let [key, value] of Object.entries(userInfo)){
            if(key !== 'u_id'){
                query += key+'=?,'
                params.push(value)
            }
        }
        query = query.substring(0, query.length - 1)
        query = 'update users set '+query+' where u_id='+userInfo.u_id

        console.log(query)
        return db.run(query, params)

    }

    function remove( { ...userInfo } ){

    }
}