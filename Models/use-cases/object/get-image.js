const { makeObject } = require('../../entities')

const fs = require('fs')
const path = require('path')

exports.makeGetImage = ({ objectsTbl })=>{
    return async function(o_id){
        let result = await objectsTbl.getById(o_id)

        let obj = {
            'path': Buffer.from(o_id).toString('base64')
        };

        if(!result.length > 0){
            throw('Object not found !!')
        }

        result[0]['parent_id'] = result[0]['parent_id']+''
        let object = makeObject(result[0])
        obj['mime'] = object.getMimeType();

        if(object.getEncoded() && object.getEncoded() !== ''){
            obj['base64'] = object.getEncoded();
            return obj;
        }
        console.log("I should not print")
        let compressedImgPath = path.join(process.env.NOSTALGIC_ROOT,'Compressed');
        compressedImgPath = path.join(compressedImgPath, object.getVName());
        
        if(!fs.existsSync(compressedImgPath)){
            throw('File not found')
        }

        let base = fs.readFileSync(compressedImgPath); 
        base = Buffer.from(base, "binary").toString("base64");

        obj['base64'] = base;
        let temp = { 'o_id':o_id, 'encoded': base }
        objectsTbl.update(temp)

        return obj;
    }
}