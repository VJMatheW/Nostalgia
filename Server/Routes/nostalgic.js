const router = require('express').Router()
const fs = require('fs');
const path = require('path');

const { HttpService } = require('../../Components')
const { ObjectService, LinkSharingService } = require('../../Models')

router.get('/', (req, res)=>{
    res.status(200).text('Hello from /api/nostalgic')
})

/** List contents for home directories */
router.get('/listing', async (req, res)=>{ 
    let u_id = req.body.u_id;
    let parent_id = 0;

    try{
        let obj = await ObjectService.selectObject(u_id, parent_id)        
        res.json(obj)
    }catch(err){
        res.status(422).json({ 'error': err })
    }
})

/** List contents for sub directories */
router.get('/listing/:path', async (req, res)=>{
    let u_id = req.body.u_id;
    let parent_id = decode(req.params.path);

    try{
        let obj = await ObjectService.selectObject(u_id, parent_id, false) //         
        res.json(obj)
    }catch(err){
        res.status(422).json({ 'error': err })
    }
})

/** Handles when newfolder is created */
router.post('/newfolder', async (req, res)=>{
    let folder = req.body;        
    folder.o_type = '1';  // 1 for folders
    folder.v_name = folder.name;
    folder.parent_id = decode(folder.base)
    folder.created_by = folder.u_id
    console.log(folder)
    try{        
        let objectId = await ObjectService.addObject(folder)
        let encodedFolderId = Buffer.from(objectId+'').toString('base64')
        res.status(201).json({ 'status': true, 'folderName': folder.name, 'encodedPath': encodedFolderId})
    }catch(err){
        res.status(422).json({'error': err})
    }  
})

/** Handles when image is uploaded */
router.post('/upload', (req, res)=>{

    let img = req.body;
    let ext = img.name.substr(img.name.lastIndexOf('.'), img.name.length);

    img.parent_id = decode(img.path);
    img.v_name = img.name.replace(ext,'')+Date.now()+ext;
    img.o_type = '2'; // 2 for image files
    img.created_by = img.u_id;

    let destPath = path.join(process.env.NOSTALGIC_ROOT, 'Original');

    try{
        if(img.path && fs.existsSync(destPath)){
            let base64Data = img.base64.toString().replace(/^data:(.*,)?/,'');
            let destFile = path.join(destPath, img.v_name);
        
            fs.writeFile(destFile, base64Data, "base64", async function(err) {
                if(err){
                    throw(err)
                }else{
                    let objectId = await ObjectService.addObject(img)
                    res.status(201).json({status: true, file: img.name})
                    callCompress(objectId);
                }
            });
        }else{
            res.json({status: false, desc: 'No path found'});
        }
    }catch(err){
        res.status(422).json({"error": err})
    }    
})

/** Handles when retriving compressed img */
router.get('/img/:o_id',async (req, res)=>{
    let o_id = decode(req.params.o_id);
    try{
        let obj = await ObjectService.getImage(o_id);
        res.json(obj)
    }catch(err){
        res.status(422).json({'error': err})
    }
})

/** Handles when delete an img */
router.post('/delete/img/:o_id', async(req, res)=>{
    let u_id = req.body.u_id
    let o_id = decode(req.params.o_id)
    try{
        let fname = await ObjectService.deleteImage(o_id, u_id)
        res.status(201).json({status: true})
        // delete the files in here
        deleteOriginalAndCompressedImage(fname)
    }catch(err){
        res.status(401).json({'error': err})
    }
})

/** Handles the download feature */
router.get('/download/:hq/:path', async (req, res)=>{
    let o_id = decode(req.params.path);
    let hq = req.params.hq;
    try{
        let obj = await ObjectService.downloadObject(o_id)
        let temp = path.join( hq == 'true' ? 'Original' : 'Compressed' , obj.v_name)
        temp = Buffer.from(Date.now()+"-"+temp+"-"+obj.name).toString('base64')
        res.json({'token': temp})
    }catch(err){
        res.status(422).json({'error': err})
    }
})

/** Handles creating shareable link */
router.get('/share/:o_id', async (req, res)=>{
    console.log('shre o_id: ', req.params.o_id)
    let o_id = Buffer.from(req.params.o_id, 'base64').toString('ascii')
    let u_id = req.body.u_id
    try{
        if(o_id == 0){
            throw('You cannot share home folder')
        }
        let obj = await ObjectService.isAuthorized(o_id, u_id)        
        let share_id = await LinkSharingService.addLinkSharing(o_id, u_id)
        // console.log('/shared/'+obj.name+'/'+Buffer.from(share_id+'').toString('base64'))
        res.status(200).json({'link': '/share#'+encodeURIComponent(obj.name.replace(/\ /gi,'_'))+'/'+Buffer.from(share_id+'').toString('base64') })           
    }catch(err){
        console.log("Error : ",err)
        if(err.startsWith('Unauthorized')){
            res.status(401).json({'error': err})
            return;
        }
        res.status(422).json({ 'error': err })
    }
})

/** Handles the requester request for directory */
router.get('/share/auth/:share_id', async (req, res)=>{
    let share_id = Buffer.from(req.params.share_id,'base64').toString('ascii')
    let u_id = req.body.u_id
    try{
        let obj = await LinkSharingService.addLinkSharingRequest(share_id, u_id)
        console.log('linksharingrequest : ', obj)
        if(obj.status){ // if obj.status is true
            res.status(200).json({ 'name': obj.name, 'status': obj.status, 'o_id': Buffer.from(obj.o_id+'').toString('base64') })
        }else if(obj.status == null || !obj.status){
            res.status(200).json({ 'name': obj.name, 'status': obj.status, 'info': `Access Premission for ${(obj.o_name).toUpperCase()} has been sent to ${obj.u_name}. We will get back to you once ${obj.u_name} accepts your request.<br/>Click <a href='/'>Home</a> for home page` })
        }
    }catch(err){
        console.log(err)
        res.status(422).json({'error': err})
    }
})

function decode(str){
    if(str){
        return Buffer.from(str,'base64').toString('ascii')
    }
}

function callCompress(o_id){
    const http = require('http');
    HttpService.get(`http://localhost:5001/compress/${o_id}`, (res)=>{
        // console.log(res);
    })
}

function deleteOriginalAndCompressedImage(fileName){
    let p = path.join(process.env.NOSTALGIC_ROOT, 'Compressed')
    p = path.join(p,fileName)
    try{
        if(fs.existsSync(p)){
            fs.unlink(p,(err)=>{
                if(err) throw err
            })
        }
        p = p.replace('Compressed', 'Original')
        if(fs.existsSync(p)){
            fs.unlink(p,(err)=>{
                if(err) throw err
            })
        }
    }catch(err){
        console.log(err)
    }
}

module.exports = router;