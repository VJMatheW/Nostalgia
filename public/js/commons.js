const controller = new AbortController();
// signal to pass to fetch
const signal = controller.signal;

function _(id){
    return document.getElementById(id);
}

function get(url, headers){
    return fetch(url, {signal: signal}).then(res=>{ return res.json();});
}

function getImg(url, headers){
    return fetch("/api/img/"+url, {signal: signal}).then(res=>{ return res.json();});
}

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

function getIndex(container, child){
    return Array.prototype.slice.call(container).indexOf(child);
}