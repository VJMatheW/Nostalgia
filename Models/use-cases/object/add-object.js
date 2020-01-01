const { makeObject } = require('../../entities')

exports.makeAddObject = function({ objectsTbl }){
    return async function addObject( objectInfo ){
        const object = makeObject(objectInfo)
        
        return objectsTbl.insert({
            name: object.getName(),
            v_name: object.getVName(),
            parent_id: object.getParentId(),
            o_type: object.getOType(),
            created_by: object.getCreatedBy()          
        })
    }
}