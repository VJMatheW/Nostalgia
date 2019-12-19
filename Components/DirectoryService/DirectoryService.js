'use strict';
const fs = require('fs');
const path = require('path');

function DirectoryService(path){
    path = this.decode(path);
    if(fs.existsSync(path)){
        this.path = path;
        this.dirListing = this.dirListing();        
    }    
}

DirectoryService.prototype.dirListing = function(){
    let obj = {
        folders: [],
        files: [],
        path: '',
        oname: []
    }

    if(fs.existsSync(this.path)){
        obj.path = this.encode(this.path);
        let names = fs.readdirSync(this.path);
        names.forEach( name => {
            if(fs.lstatSync(path.join(this.path,name)).isDirectory()){
                obj.folders.push({folderName: name, encodedPath: Buffer.from(path.join(this.path,name)).toString('base64') });
            }else{
                if(name.toLowerCase().endsWith('g')){ // to have only img file no video file
                    obj.oname.push(name);
                    obj.files.push(Buffer.from(path.join(this.path,name)).toString('base64'));
                }
            }
        });        
    }
    return obj;
}

DirectoryService.prototype.createNewFolder = function(folderName, callback){
    this.path = path.join(this.path,folderName)
    fs.mkdir(this.path, {recursive: true}, (err)=>{
        if(err){
            callback(err);            
        }else{
            fs.mkdir(this.path.replace('Compressed', 'Original'), {recursive: true}, (err)=>{});
            callback(false);
        }
    })
}

DirectoryService.prototype.encode = function(){
    return Buffer.from(this.path).toString('base64');
}

DirectoryService.prototype.decode = function(path){
    return Buffer.from(path,'base64').toString('ascii');
}

module.exports = DirectoryService;