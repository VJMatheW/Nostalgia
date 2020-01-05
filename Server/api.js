const router = require('express').Router();
const fs = require('fs');
const path = require('path');
// const Pool = require('worker-threads-pool')

// Require
const { ImageService, AuthenticationService } = require('../Components');
const { LinkSharingService } = require('../Models')
const fsys = require('./Routes/filesystem');
const nostalgic = require('./Routes/nostalgic');
const aurora = require('./Routes/aurora')

// Middleware
let verifyToken = (req, res, next)=>{
    try{
        let authHead = req.get('Authorization');
        let arr = authHead.split(' ');
        let payload = AuthenticationService.jwt.verify(arr[1]);
        if(payload){
            req.body.u_id = payload.u_id;
            next()
        }else{
            res.status(401).json({'error': 'Token Expired'})
        }
    }catch(err){
        res.status(401).json({'error': 'Token Required'})
    }
    
}

// Routes
router.use('/fs', fsys);
router.use('/nostalgic', verifyToken);
router.use('/nostalgic', nostalgic);
router.use('/aurora', aurora);

// const pool = new Pool({max: require('os').cpus().length});

router.get('/', (req, res)=>{
    res.status(200).send("Hello fom /api");
})

router.get('/download/:link', (req, res)=>{
    try{
        let link = Buffer.from(req.params.link,'base64').toString('ascii');
        if(!link.includes('-')){
            throw('File does not exists')
        }
        let arr = link.split('-');
        res.download(path.join(process.env.NOSTALGIC_ROOT, arr[1]), arr[2]);
    }catch(err){
        res.status(422).json({'error': err})
    }
})

router.get('/img/:path', (req, res)=>{
    let img_path = Buffer.from(req.params.path, 'base64').toString('ascii');
    let img = new ImageService(img_path);
    let obj = {
        base64: img.base64,
        mime: img.mimeType,
        path: req.params.path
    };
    if(img.exif){
        obj['date'] = img.exif.DateTime;
        obj['orientation'] = img.exif.Orientation;
        if(img.exif.SubExif){
            obj['width'] = img.exif.SubExif.PixelXDimension;
            obj['height'] = img.exif.SubExif.PixelYDimension;
        }        
    }
    
    res.json(obj);
})

router.get('/files', (req, res)=>{
    let folder_path = "I:\\VJ\\Betrothal-Candid";
    let encoded = [];
    let pics = fs.readdirSync(folder_path);
    pics.forEach((pic,index) => {
        encode = Buffer.from(path.join(folder_path,pic)).toString('base64');
        encoded.push(encode);
    });
    res.json(encoded);
})

router.post('/upload', (req, res)=>{
    let img = req.body;

    let destPath = Buffer.from(img.path,'base64').toString('ascii').replace('Compressed', 'Original');
    if(img.path && fs.existsSync(destPath)){
        let base64Data = img.base64.toString().replace(/^data:(.*,)?/,'');
        let fileName = img.name;
        let destFile = path.join(destPath, fileName);
        fs.writeFile(destFile, base64Data, "base64", function(err) {
            if (err) {
                console.log(err);
            } else {
                res.json({status: true, file: fileName});
                const { Worker } =  require('worker_threads');
                let workerData  = JSON.stringify({destPath: destPath, fileName: fileName});
                let worker = new Worker(path.join(__dirname,'../Components/worker.js'), {workerData});
                worker.on('message', (msg)=>{
                    console.log(msg);
                });
                worker.on('error', (err)=>{
                    console.log("Worker ",err);
                });
                // pool worker code goes here
                // pool.acquire('../Components/worker.js', {destPath: destPath, fileName: fileName},()=>{});
            }
        });
    }else{
        res.json({status: false, desc: 'No path found'});
    }
})

router.get('/download/:hq/:path', (req, res)=>{
    let img_path = Buffer.from(req.params.path, 'base64').toString('ascii');
    console.log(req.params.hq);
    if(req.params.hq == 'true'){
        img_path = img_path.replace('Compressed', 'Original').replace('_compressed_720_50','');
    }
    // img_path = img_path.replace('_compressed_720_50','');
    res.download(img_path);
})

router.get('/src', (req, res)=>{
    res.sendFile('E:\\Songs\\Tamil Songs\\Darbar\\Chumma_Kizhi-StarMusiQ.Top.mp3');
})

router.get('/share/:share_id', (req, res)=>{
    let share_id = decode(req.params.share_id)
    res.redirect('/signin.html#testshareresult');
})

/** Handle to give access to requester by owner */
router.get('/auth/:share_auth_id',async (req, res)=>{
    let share_auth_id = decode(req.params.share_auth_id)
    try{
        let result = await LinkSharingService.confirmLinkSharingRequest(share_auth_id);
        res.json({'info': 'Successfully done'})
    }catch(err){
        res.status(422).json({'error': err})
    }
})


function decode(str){
    return Buffer.from(str,'base64').toString('ascii')
}
module.exports = router;