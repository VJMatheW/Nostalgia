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

module.exports = router;