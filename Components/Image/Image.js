const fs = require('fs');
const exif = require('jpeg-exif');

function Image(img_path){      
    this.img_path = img_path; 
    this.mimeType = this.mimeType();   
    this.base64 = this.toBase64();  
    this.exif = this.exif();  
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

module.exports = Image;