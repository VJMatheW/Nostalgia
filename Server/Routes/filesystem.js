const router = require('express').Router();
const DirectoryService = require('../../Components').DirectoryService;

router.get('/', (req, res)=>{
    res.status(200).send('Hello from /api/fs');
})

router.get('/listing', (req, res)=>{
    let base_dir = process.env.root;
    let dirSer = new DirectoryService(Buffer.from(base_dir).toString('base64'));
    res.json(dirSer.dirListing);
})

router.get('/listing/:path', (req, res)=>{
    let base_dir = req.params.path;
    let dirSer = new DirectoryService(base_dir);
    res.json(dirSer.dirListing);
})

router.post('/newfolder', (req, res)=>{
    let folder = req.body;
    let basePath = folder.base;
    let folderName = folder.name;
    console.log("nEw folder path : ",folder)
    let dirSer = new DirectoryService(basePath);
    dirSer.createNewFolder(folderName, (err)=>{
        if(err){
            res.json({status : false, error : err});
        }else{
            res.json({status: true, folderName: folderName, encodedPath: dirSer.encode()});
        }
    });
})

module.exports = router;