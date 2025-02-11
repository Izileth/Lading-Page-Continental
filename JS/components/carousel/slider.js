let count = 1;
document.getAnimations("radio1").checked = true;

setInterval(function() {
    nextImage();
    console.log(count);
},5000)

function nextImage(){
    count++;
    if(count > 5) {
        count = 1;
    };

    document.getElementById("radio" + count).checked = true;

}