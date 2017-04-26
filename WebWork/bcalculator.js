//var d,op;
var num1,op;
$(document).ready(function(){
	$("#b2").click(function(){
	$("#b2").css("display","none");
	});
});
//function first(){	
function genDis(n){
   var d= document.getElementById('display').value;
	document.getElementById('display').value =d + "" + n;
	num1=d+n;
	alert(num1);
}


function get-operator(ope){	
var sp=document.getElementById('display').value;
document.getElementById('display').value = ope;
alert(ope);
}
/*
function operatord(){
	num1=parseInt(arr);
	alert(num1);
	arr2[j]=document.getElementById('ope1').value;
	document.getElementById('display').value=arr+arr2;
	alert(arr2);
	op=arr2[j];
	j=j+1;	
	//ans=num1 + num2;
	//document.getElementById('display').value=ans;
}
function operatorm(){
	num1=parseInt(arr);
	//alert(num1);
	arr2[j]=document.getElementById('ope2').value;
	document.getElementById('display').value=arr+arr2;
	//alert(arr2);
	op=arr2[j];
	j=j+1;	
	//ans=num1 + num2;
	//document.getElementById('display').value=ans;
	//ans=num1 + num2;
	//document.getElementById('display').value=ans;
}*/
/*
function operatorsqrt(){
	num1=parseInt(arr);
	//alert(num1);
	arr2[j]=document.getElementById('ope3').value;
	document.getElementById('display').value=arr+arr2;
	 ans=Math.sqrt(num1);
	 alert(ans);
	 document.getElementById('display').value=ans;
	//ans=num1 + num2;
	//document.getElementById('display').value=ans;
	//ans=num1 + num2;
	//document.getElementById('display').value=ans;
}/*
function operatorp(){
	num1=parseInt(arr);
	//alert(num1);
	arr2[j]=document.getElementById('ope4').value;
	document.getElementById('display').value=arr+arr2;
	//alert(arr2);
	op=arr2[j];
	alert(arr2);
	j=j+1;	
	//ans=num1 + num2;
	//document.getElementById('display').value=ans;
}/*
function operators(){
	num1=arr;
	alert(num1);
		arr2[j]=document.getElementById('ope5').value;
	document.getElementById('display').value=arr+arr2;
	alert(arr2);
	op=arr2[j];
	j=j+1;		//ans=num1 + num2;
	//document.getElementById('display').value=ans;
}
function operatora(){
	num1=arr;
	alert(num1);
	arr2[j]=document.getElementById('ope6').value;
	document.getElementById('display').value=arr+arr2;
	alert(arr2);
	op=arr2[j];
	j=j+1;		//ans=num1 + num2;
	//document.getElementById('display').value=ans;
}
	//ans = num1 + num2;
	//document.getElementById('display').value=ans;
	function b1v2(){
	arr3[k]=parseInt(document.getElementById('b1').value);
	document.getElementById('display').value=arr+arr2+arr3;
	alert(arr3);
	k=k+1;
}
function b2v2(){
	arr3[k]=parseInt(document.getElementById('b2').value);
	document.getElementById('display').value=arr+arr2+arr3;
	alert(arr2);
	k=k+1;
}
function b3v2(){
	arr3[k]=parseInt(document.getElementById('b3').value);
	document.getElementById('display').value=arr+arr2+arr3;
	alert(arr3);
	k=k+1;
}
function b4v2(){
	arr3[k]=parseInt(document.getElementById('b4').value);
	document.getElementById('display').value=arr+arr2+arr3;
	alert(arr3);
	k=k+1;
}
function b5v2(){
	arr3[k]=parseInt(document.getElementById('b5').value);
	document.getElementById('display').value=arr+arr2+arr3;
	alert(arr3);
	k=k+1;
}
function b6v2(){
	arr3[k]=parseInt(document.getElementById('b6').value);
	document.getElementById('display').value=arr+arr2+arr3;
	alert(arr3);
	k=k+1;
	}
function b7v2(){
	arr3[k]=parseInt(document.getElementById('b7').value);
	document.getElementById('display').value=arr+arr2+arr3;
	alert(arr3);
	k=k+1;
}
function b8v2(){
	arr3[k]=parseInt(document.getElementById('b8').value);
	document.getElementById('display').value=arr+arr2+arr3;
	alert(arr3);
	k=k+1;
}
function b9v2(){
	arr3[k]=parseInt(document.getElementById('b9').value);
	document.getElementById('display').value=arr+arr2+arr3;
	alert(arr3);
	k=k+1;
}
function b0v2(){
	arr3[k]=parseInt(document.getElementById('b0').value);
	document.getElementById('display').value=arr+arr2+arr3;
	alert(arr3);
	k=k+1;
}

//}*/
function calculations(){
//alert(arr);

num1=(arr);
num2=(arr3);
//alert(num+num2);
//num1.toString();
alert(num1);
var n1=parseInt(num1);
alert(n1);
alert(arr2);
//alert(num2);
var n2=parseInt(num2);
alert(n2);

if(op=='+'){
	alert("plus");
	var ans=n1+n2;
	alert(ans);
	document.getElementById('display').value=ans;
}
else if(op=='/'){
     alert("division");
	 var ans=num1/num2;
	alert(ans);
	document.getElementById('display').value=ans;
}
else if(op=='*'){
     alert("multipl");
	 var ans=num1*num2;
	alert(ans);
	document.getElementById('display').value=ans;
}
else if(op=='-'){
     alert("subtr");
	  var ans=num1-num2;
	alert(ans);
	document.getElementById('display').value=ans;
}
else if(op=='%'){
     alert("percentage");
	  var ans=num1%num2;
	alert(ans);
	document.getElementById('display').value=ans;
}
//var num2=(num1);
//alert(num2);
//var num2=arr2;
//alert(num2);
}/*
	
	var a=document.getElementById('b2').value;
	alert(a);
	for(i=0;i<10;i++){
		arr[i]=document.getElementById('b1').value;
		b=b+1;
	}
	alert("array is "+arr);
}*/