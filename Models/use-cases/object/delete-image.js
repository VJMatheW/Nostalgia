const { makeObject } = require('../../entities')

exports.makeDeleteImage = function({ objectsTbl }){
    return async function deleteImage (o_id, u_id){
        let obj = await objectsTbl.getById(o_id)
        if(!obj.length > 0){
            throw('Object not found')
        }

        let object = makeObject(obj[0])

        if(!u_id == object.getCreatedBy()){
            throw('Permission Denied')
        }

        let changedRows = await objectsTbl.deleteById(o_id)
        console.log('Affected rows : ',changedRows)
        if(!changedRows > 0){
            throw('Not virtually Deleted')
        }
        
        return object.getVName() // returning virtual name saved in fs
    }
}