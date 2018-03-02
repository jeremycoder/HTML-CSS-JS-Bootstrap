$("#hplogo").keypress(function() {$(#hplogo).css("width", $(#hplogo).css("width")+5); });

$("#hplogo").keypress( function() {
 console.log("hello!");
});

var r = 10, g = 200,  b = 110;
$("html").keypress(function() { 
 
 r++; g--; b = b-2;
 var color = "rgb("+r+","+g+","+b+")";

 $("body").css("background-color", color);

 });