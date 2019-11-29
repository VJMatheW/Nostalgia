let images = [];

function fetchFiles(){
    fetch('/api/files')
    .then(response => {
        return response.json();
    })
    .then(arr=>{
        images = arr;
        forward();                
    })
}
function backward(){
    --initvalue;    
    setImage();
}
function forward(){    
    ++initvalue;
    setImage();    
}
function setImage(){
    console.log("setting imge");
    let img = _('img');
    console.log("Setimg initvalue  : ", initvalue)
    initvalue = initvalue % images.length;    
    fetch('/api/img/'+images[initvalue])
    .then(response =>{
        return response.json();
    })
    .then(obj =>{        
        setDimension(obj.width, obj.height, obj.orientation);
        _('img').src = "data:"+obj.mime+";base64, "+obj.base64; 
        setTimeout(()=>{
            if(slideshow){
                console.log("change");
                forward();
            }
        }, 2000);       
    })
}
function setDimension(iw, ih, ori){
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    h = h - 50;
    w = w - 50;
    if(ih > iw && h > w){                
        w = h*0.6;        
    }else if(iw > ih && h > w){
        h = w*0.6;        
    }else if(w > h && ih > iw){
        w = h*0.6;
    }
    _('width').innerHTML = "Width : "+w;
    _('height').innerHTML = "Height : "+h;
    _('iw').innerHTML = "Img Width : "+iw;
    _('ih').innerHTML = "Img Height : "+ih;
    _('ori').innerHTML = "Orientation : "+ori;    
    _('img').height = Math.min(ih, h);
    _('img').width = Math.min(iw, w);
}

/**
    func to set files and folders
 */
function fetchDir(e,folObj=""){
    observer.disconnect(); // release all target from watching   
    // controller.abort(); 
    let apiEndPoint = '';
    if(folObj == ""){
        apiEndPoint = '/api/fs/listing'; // home directory
    }else{
        apiEndPoint = '/api/fs/listing/'+folObj.encodedPath;        
    }
    get(apiEndPoint)
    .then(obj=>{        
        updateDirectoryListing(obj);
        updateRoute(e, folObj);
    })
}

/**
    func to update the path on the top
 */
function updateRoute(e, folObj){
    if(e){
        let index = Array.prototype.slice.call(e.target.parentElement.children).indexOf(e.target);
        let children = e.target.parentElement.children;
        for(i=children.length-1; i>=(index+1); i--){  // removed from reverse because when one node removed length decreases
            children[i].remove();
        }
    }else{
        if(folObj){
            let span = create('span', ' route');
            span.innerHTML = '/'+folObj.folderName;
            span.onclick = function(e){
                fetchDir(e, folObj);
            }
            append(_('routes'), span);
        }        
    }
}

/**
    function on home btn on-click
 */
function clearRoute(){
    _('routes').innerHTML = "";
    fetchDir();
}

/**
    back to top btn func
 */
function moveToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

/**
    hide or display back to top btn
 */
window.onscroll = function() {
    let backToTopBtn = _("back-to-top-btn");
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
    }else{
        backToTopBtn.style.display = "none";
    }    
};