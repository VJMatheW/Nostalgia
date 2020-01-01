const { makeUser } = require('../../entities')

exports.makeValidateUserByEmail = ({ usersTbl, addUser })=>{
    return async function validateUserByEmail(email_id, u_name){
        
        let result = await usersTbl.findByEmail(email_id)

        var obj = {};
        
        if(!result.length > 0){ // new user
            try{
                let u_id = await addUser({'u_name': u_name, 'email_id': email_id})
                obj['u_name'] = u_name;
                obj['u_id'] = u_id;
                return obj;
            }catch(err){
                console.log("Error : ", err)
                throw(err)
            }
        }

        let user = makeUser(result[0])
        obj['u_name'] = user.getName();
        obj['u_id'] = user.getUid();
        return obj;
    }
}