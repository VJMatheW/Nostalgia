const fs = require('fs');
const exif = require('jpeg-exif');
const jimp = require('jimp');
const path = require('path');

function Image(img_path, calc= true){      
    this.img_path = img_path; 
    this.exif = this.exif();
    if(calc){
        this.mimeType = this.mimeType();   
        this.base64 = this.toBase64();  
    }
}

Image.prototype.path = function(){    
    console.log(this.img_path);
}

Image.prototype.exif = function(){
    if(fs.existsSync(this.img_path)){
        let img = fs.readFileSync(this.img_path);        
        imgBuf = Buffer.from(img, "binary");
        return exif.fromBuffer(imgBuf);        
    }else{
        return false;
    }
}

Image.prototype.toBase64 = function(){
    if(fs.existsSync(this.img_path)){
        let img = fs.readFileSync(this.img_path);        
        img = Buffer.from(img, "binary").toString("base64");                
        return img;
    }else{
        return false;
    }
}

Image.prototype.mimeType = function(){        
    let ext = this.img_path.substr(this.img_path.lastIndexOf('.')+1, this.img_path.length).toLowerCase();
    if(ext.startsWith('j')){
        return 'image/jpeg';
    }else if(ext.startsWith('p')){
        return 'image/png';
    }    
}

Image.prototype.calcWH = function(meta, height=1080) {
    if(meta.orientation == 8 || meta.orientation == 6){
        if(meta.orientation == 8 && meta.height > meta.width){
            return Math.ceil((meta.width*height)/meta.height); // h > w
        }else{
            return Math.ceil((meta.height*height)/meta.width);   // w > h
        }
    }else{
        return Math.ceil((meta.width*height)/meta.height); // h > w
    }
}

Image.prototype.getMetaData = function(){
    let img_path = this.img_path;
    let obj = {};
    console.log(this.exif);
    if(fs.existsSync(this.img_path)){     
        obj['orientation'] = this.exif.Orientation;
        if(this.exif.SubExif){
            obj['width'] = this.exif.SubExif.PixelXDimension || this.exif.ImageWidth;
            obj['height'] = this.exif.SubExif.PixelYDimension || this.exif.ImageHeight;
        } 
        obj['status'] = true;
        return obj;
    }else{
        obj['status'] = false;
        return obj;   
    }    
}

Image.prototype.compress = function(width, height, quality=80){
    let img_dest_path = this.img_path.substr(0,this.img_path.lastIndexOf(path.sep)).replace('Original', 'Compressed');
    let fileNameWithExt = this.img_path.substr(this.img_path.lastIndexOf(path.sep)+1, this.img_path.length);
    let ext = fileNameWithExt.substr(fileNameWithExt.lastIndexOf('.'), fileNameWithExt.length);
    let fileName = fileNameWithExt.replace(ext, "");

    let strt = new Date();

    return jimp.read(this.img_path)
    .then(img=>{
        return img
        .resize(width,height)
        .quality(quality)
        .write( path.join(img_dest_path,fileName+'_compressed_'+height+'_'+quality+ext));    
    })
    .then(obj=>{
        let end = new Date();
        let totalTime = Math.ceil((end - strt)/1000);
        return {status: true, time: totalTime};
    })
    .catch(err=>{
        console.log(err);
    })
}

Image.prototype.calcOrientation = function(width, height){
    console.log("called orientation")
    if(width > height){
        return 1; // landscape
    }else if(height > width){
        return 8; // portrait
    }else{
        return 1; // square | landscape
    }
}

module.exports = Image;