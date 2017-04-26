$(function(){
$("#leftbtn").click(function(){
reverse();
});

$("#rightbtn").click(function(){
slide(-1);
});

$("#slider").load(function(){
autoSlide();
});
	
});
var imgcount=1;
var total=4;
var arr = [];

//$("#rightbtn").onclick="func(-1)";
//get slider div
//get its child and their sources
//put sources in arr array..
//arr[0] = 1 st img src
//arr[1] = 2nd img src
function slide(x){
	var a=document.getElementById('images1');
	imgcount=imgcount+1;
	if(imgcount<1){
		imgcount=total;
	}
	if(imgcount>total){
		imgcount=1;
	}
	//a.src = arr[x]
	a.src="images/img"+imgcount+".jpg";
}

function  reverse(){
	//imgcount2=imgcount;
	var a=document.getElementById('images1');
	imgcount=imgcount-1;
	if(imgcount<1){
		imgcount=total;
	}
	if(imgcount>total){
		imgcount=1;
	}
	a.src="images/img"+imgcount+".jpg";
}

window.setInterval(function autoSlide(){
	var a=document.getElementById('images1');
	imgcount=imgcount+1;
	if(imgcount<1){
		imgcount=total;
	}
	if(imgcount>total){
		imgcount=1;
	}
	a.src="images/img"+imgcount+".jpg";
}
,5000);


//document.getElementById('leftbtn').onclick = function(){ reverse(); };

/*
$("#leftbtn").hide();

$(document).ready(function(){
  $("img").click(function(){
	  reverse();
  });
});
$("#rightbtn").onClick="func(-1)";

//window.onload = function(){
//	funcA();
//}
*/