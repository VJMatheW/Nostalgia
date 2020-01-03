const { makeObject } = require('../../entities')

exports.makeSelectObject = ({ objectsTbl })=>{
    return async function(u_id, parent_id, ishome=true){
        console.log("Parent_ID ",parent_id)
        var obj = {
            "folders": [],
            "files": [],
            "path": Buffer.from(parent_id+'').toString('base64')
        }
        let result = [];
        
        if(ishome){
            result = await objectsTbl.getHomeForUser(u_id, parent_id)
        }else{
            result = await objectsTbl.getForUser(u_id, parent_id)
        }
        
        if(!result.length > 0){
            return obj
        }

        result.forEach(row => {
            row['parent_id'] = row['parent_id']+''; // or it will interpreted as false while makingObject
            let object = makeObject(row);
            if(object.getOType() == '1'){ // folder
                let temp = {}
                temp.folderName = object.getName()
                temp.encodedPath = object.getEncodedOid()
                obj.folders.push(temp)
            }

            if(object.getOType() == '2'){ // files images 
                obj.files.push(object.getEncodedOid())
            }
        });
        return obj
    }
}