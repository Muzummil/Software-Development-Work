
$(document).ready(function(){
console.log('hiding..');
//$(":button").css('backgroundColor','lightskyblue');
//$(":button").onmouseup(styling());	
//$(":button").onmouseover(styling2());
//$(":button").onmouseenter(styling3());	

});

function styling(){
	$(":button").css('backgroundColor','red');
}
function styling2(){
	$(":button").css('backgroundColor','yellow');
}
function styling3(){
	$(":button").css('backgroundColor','green');
}
var num1,op,num2, sp=0,sp2=0;
function genDis(n){
   var d= document.getElementById('display').value;
	document.getElementById('display').value =d + "" + n;
	num1=d+n;
}
function getoperator(ope){	
if(sp==0){
	sp=document.getElementById('display').value;
}else{
	sp2=document.getElementById('display').value;
}
document.getElementById('display').value = '';
if(ope!=undefined && ope!=0){
	op = ope;
}
//genDis(n2);
}

function clr(){
	document.getElementById('display').value ="";
}

function calculations(){
getoperator(0);
console.log(op);
//alert(n2);
if(op=="+"){
	var ans= parseFloat(sp)+parseFloat(sp2);
	document.getElementById('display').value=ans;
	sp=ans;
	sp2=0;
}
else if(op=='sqrt'){
	 var ans=Math.sqrt(num1);
	 document.getElementById('display').value=ans;
}
else if(op=='/'){
     var ans= parseFloat(sp)/parseFloat(sp2);
	document.getElementById('display').value=ans;
	sp=ans;
	sp2=0;
}
else if(op=='*'){
     var ans= parseFloat(sp)*parseFloat(sp2);
	document.getElementById('display').value=ans;
	sp=ans;
	sp2=0;
}
else if(op=='-'){
     var ans=parseFloat(sp)-parseFloat(sp2);
	document.getElementById('display').value=ans;
	sp=ans;
	sp2=0;
}
else if(op=='%'){
     var ans= parseInt(sp) % parseInt(sp2);
	document.getElementById('display').value=ans;
	sp=ans;
	sp2=0;
}
}