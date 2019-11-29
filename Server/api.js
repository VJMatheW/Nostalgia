const router = require('express').Router();
const fs = require('fs');
const path = require('path');

// Require
const Image = require('../Components').Image;
const fsys = require('./Routes/filesystem');

// Routes
router.use('/fs', fsys);



router.get('/', (req, res)=>{
    res.status(200).send("Hello fom /api");
})

router.get('/img/:path', (req, res)=>{
    let img_path = Buffer.from(req.params.path, 'base64').toString('ascii');
    let img = new Image(img_path);
    let obj = {
        base64: img.base64,
        mime: img.mimeType
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

module.exports = router;