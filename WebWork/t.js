
function tableFunction(){
var num=document.getElementById('numid').value;
for(var v=1;v<=20;v++){
	ans=num*v;
	var p=document.getElementById('display').innerHTML;
	document.getElementById('display').innerHTML=p+'<b>'+num+'*'+v+'='+ans+'<br>';
	
	//document.write("<b>"+num+"*"+v+"="+ans+"<br>");
}
}