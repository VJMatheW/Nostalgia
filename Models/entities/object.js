exports.buildObject = function(){
    return function object({
        o_id,
        name,
        v_name,
        parent_id,
        o_type,
        created_on,
        created_by,
        encoded,
        digitized_date,
        mimeType
    } = {}){
        if(!name){
            throw('Name should be present')
        }

        if(!parent_id){
            throw('Parent Id is must')
        }

        if(!o_type){
            throw('Object type must present')
        }

        if(!created_by){
            throw('Created By whom ?')
        }

        return Object.freeze({
            getOid: ()=> o_id,
            getEncodedOid: ()=>{ return Buffer.from(o_id+'').toString('base64') },
            getName: ()=> name,
            getVName: ()=> v_name,
            getParentId: ()=> parent_id,
            getEncParentId:()=> { return Buffer.from(parent_id='').toString('base64')},
            getOType: ()=> o_type,
            decode: (str)=> decode(str),
            getCreatedOn: ()=> created_on,
            getCreatedBy: ()=> created_by,
            getEncoded: ()=> encoded,
            getDigitizedDate: ()=> digitized_date,
            getMimeType: ()=> mimeType
        })

        function decode(str){
            console.log('Decode', str)
            return Buffer.from(str,'base64').toString('ascii');
        }

        function mime(){        
            let ext = name.substr(name.lastIndexOf('.')+1, name.length).toLowerCase();
            if(ext.startsWith('j')){
                return 'image/jpeg';
            }else if(ext.startsWith('p')){
                return 'image/png';
            }    
        }
    }
}