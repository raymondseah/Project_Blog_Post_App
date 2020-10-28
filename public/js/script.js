$(document).ready(function(){
var images = [
    "/images/fabrizio-conti-FsRI38AUqrY-unsplash.jpg",
    "/images/jeremy-bishop-mA9abjhEG4A-unsplash.jpg",
    "/images/yang-shuo-WLgQOKuMUCo-unsplash.jpg"
]

var randomIndex = Math.floor(Math.random() * images.length);
var bgImg = 'url(' + images[randomIndex] + ')';
$('body').css({'background-image':bgImg});

});