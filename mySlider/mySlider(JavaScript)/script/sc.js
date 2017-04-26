
var imgcount=1;
var total=5;
function slide(x){
	var a=document.getElementById('images1');
	a.src="images/img"+imgcount+".jpg";
	imgcount=imgcount+1;
	if(imgcount<1){
		imgcount=total;
	}
	if(imgcount>total){
		imgcount=1;
	}
}

function  reverse(){
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

