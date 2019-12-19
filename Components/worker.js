const { workerData, parentPort } = require('worker_threads');
const path = require('path');
const sizeOf = require('image-size');

console.log("Worker data", workerData);
let obj = JSON.parse(workerData);

// do not change this because if imported from ./Components it import sqlite for second time which in turn throws error
const ImageService = require('./ImageService/Image'); 


 // code for compressing the image
let img = new ImageService(path.join(obj.destPath.replace('Compressed', 'Original'),obj.fileName), false);
let metadata = img.getMetaData();
console.log("Worker : thread",metadata);
if(metadata.orientation == undefined){ 
    let wh = sizeOf(img.img_path);
    metadata['orientation'] = img.calcOrientation(wh.width, wh.height);
    metadata['width'] = wh.width;
    metadata['height'] = wh.height
}
console.log("Worker : thread",metadata);
let width = img.calcWH(metadata,720);
console.log("Worker : thread",width);
img.compress(width, 720, 50) 
.then(obj=>{
    // database insertion goes here
})