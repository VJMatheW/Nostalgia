const { makeObject } = require('../../entities')

exports.makeDownloadObject = ({ objectsTbl })=>{
    return async function(o_id){
        
        // do permission check stuffs 
        
        let result = await objectsTbl.getById(o_id);

        if(!result.length > 0){
            throw('File not found');
        }

        let object = makeObject(result[0])

        let obj = {};
        obj['name'] = object.getName();
        obj['v_name'] = object.getVName();

        return obj;
    }
}