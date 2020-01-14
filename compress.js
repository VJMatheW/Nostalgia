const path = require('path');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const sizeOf = require('image-size');

const { ImageService, DatabaseService } = require('./Components')
require('dotenv').config()

const app = express();
const db = DatabaseService.conPromise;

app.set('port', 5001);
app.use(cors());

app.listen(app.get('port'), ()=>{
    console.log("Server listening on port : ", app.get('port'));
})

// for queuing
let arr = [];
let isCompressing = false;

app.get('/compress/:o_id',async (req, res)=>{
    let o_id = req.params.o_id;
    if(!arr.includes(o_id)){ // if the object id is not already present in array then push - this stop duplicate for file not found
        arr.push(o_id);
    }
    res.sendStatus(200)

    if(!isCompressing){ // executes when not compressing
        isCompressing = true;
        await recuriveAllocate();
    }
})

async function recuriveAllocate(){
    console.log(arr)
    let o_id = arr.shift()
    console.log(o_id)
    console.log(arr)
    if(o_id){
        await compress(o_id)
        recuriveAllocate();
    }else{
        isCompressing = false
    }
}

async function compress(o_id){
    try{
        let query = 'select * from objects where o_id=?';

        let obj = await db.get(query, [o_id])
        
        // code for compressing the image
        
        let imgSrc = path.join(process.env.NOSTALGIC_ROOT ,'Original')
        imgSrc = path.join(imgSrc, obj[0].v_name)

        let img = new ImageService(imgSrc, false);
        
        let mime = img.mimeType();
        let digitized_date = img.exif.DateTime;

        let metadata = img.getMetaData();

        if(metadata.orientation == undefined){ 
            let wh = sizeOf(img.img_path);
            metadata['orientation'] = img.calcOrientation(wh.width, wh.height);
            metadata['width'] = wh.width;
            metadata['height'] = wh.height;
        }

        let width = img.calcWH(metadata,720);

        let compressObj = await img.compress(width, 720, 50)            
        
        let q = 'update objects set mimeType=?, digitized_date=? where o_id=?';
        let params = [mime, formatDateTime(digitized_date), o_id];

        await db.run(q, params)

        return;
    }catch(err){
        console.log(err);
    }
}

function formatDateTime(date){
    let arr = date.split(" ");
    arr[0] = arr[0].replace(/\:/g,'-');
    return arr[0]+' '+arr[1];
}