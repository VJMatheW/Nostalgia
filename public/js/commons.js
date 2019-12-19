const controller = new AbortController();
// signal to pass to fetch
const signal = controller.signal;

// let baseURL = 'http://colorhomes.ddns.net:8081';
let baseURL = 'http://192.168.1.12:5000';
// let baseURL = 'http://localhost:5000';

let currentDirPath = '';

function _(id){
    return document.getElementById(id);
}

function __(cls){
    return document.getElementsByClassName(cls);
}

function get(url, headers){
    return fetch(baseURL+url, {signal: signal})
    .then(res=>{ return res.json();})
    .catch(err=>{
        if(err == 'TypeError: Failed to fetch'){
            showWarning('Sorry... Our Servers are down. <br>Please try after some time.');
        }
    });
}

function getImg(url, headers){
    return fetch(baseURL+"/api/img/"+url, {signal: signal})
    .then(res=>{ return res.json();})
    .catch(err=>{
        if(err == 'TypeError: Failed to fetch'){
            showWarning('Sorry... Our servers are down. <br> Please try after some time !!!');
        }
    });
}

function post(url, data){
    return fetch(baseURL+url, {
            method: 'post',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data) // body data type mu
        })
        .then(res=>{ return res.json();})
        .catch(err=>{
            if(err == 'TypeError: Failed to fetch'){
                showWarning('Sorry... Our Servers are down. <br> Please try after some time !!!');
            }
        });
}

function postAjax(url, data, ref, contentType='application/json'){
    return new Promise((resolve, reject)=>{            
        var xmlhttp = null;                
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.upload.addEventListener("progress", progressHandler.bind(null, event, ref), false);
        xmlhttp.addEventListener("load", completeHandler.bind(null, event, ref), false);
        xmlhttp.addEventListener("error", errorHandler.bind(null, event, ref), false);
        xmlhttp.addEventListener("abort", abortHandler.bind(null, event, ref), false);
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) { // 401 unauhtorized auth possible  || 403 Forbidden (Similar to 401 but no auth possible)
                let res = JSON.parse(this.responseText);
                resolve(res);
            }else if(this.readyState == 4 && (this.status == 500 || this.status == 404)){
                reject('Error code : ', this.status);
            }
        }
        xmlhttp.open('POST', baseURL+url, true);
        xmlhttp.setRequestHeader('Content-type', contentType);
        xmlhttp.send(JSON.stringify(data));
    });
}

/**
    handler's for postAjax
 */
function progressHandler(e, ref){
    if(ref){
        let percent = Math.ceil((e.loaded/e.total)*100);
        ref.children[1].value = percent;
    }
}  

function completeHandler(e, ref){
    if(ref){
        ref.children[1].classList.remove('progress');
        ref.children[1].classList.remove('progress-error');
        ref.children[1].classList.add('progress-complete');
    }
}

function errorHandler(e, ref){
    if(ref){
        ref.children[1].classList.remove('progress');
        ref.children[1].classList.remove('progress-complete');
        ref.children[1].classList.add('progress-error');
    }
}

function abortHandler(e, ref){
    if(ref){
        ref.children[1].classList.remove('progress');
        ref.children[1].classList.remove('progress-complete');
        ref.children[1].classList.add('progress-error');
    }
}
/** Handler ends here  */

function create(tag, classname="", id="", name=""){
    var el = document.createElement(tag);        
    if(id != ""){
        el.id = id;
    }    
    if(classname != ""){
        el.className = classname;
    }
    if(name != ""){
        el.name = name;
    }
    return el;
}

function createImg(classname="",id="",src="",height="",width=""){
    var img = document.createElement("img");
    img.src = src;
    if(classname != ""){
        img.className = classname;
    }    
    if(height != ""){
        img.height = height;
    }
    if(width != ""){
        img.width = width;
    }        
    return img;
}

function append(src, dest){
    src.appendChild(dest);
    return src;
}

function prepend(parent, child){
    parent.prepend(child);
    return parent;
}

function readFileAsDataURL(file){
    return new Promise((resolve, reject)=>{  
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(){
            let dataUrl = reader.result;
            resolve({name: file.name, type: file.type, base64:dataUrl});
        }
        reader.onerror = function(){
            reject('File not read properly');
        }
    });
}

function getIndex(container, child){
    return Array.prototype.slice.call(container).indexOf(child);
}