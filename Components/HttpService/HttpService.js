const http = require('http');

function get(url, callback){
    http.get(url, (res)=>{
        let data = '';

        res.on('data', (chunk)=>{
            data += chunk;
        })

        res.on('end', ()=>{
            callback(data);
        })
    }).on('error', (err)=>{
        console.log("HttpService Error : ", err);
    })
}

function post(url, data, callback){

}

module.exports = {
    'get': get,
    'post': post
}