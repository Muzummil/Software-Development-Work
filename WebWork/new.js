var i=0,g,num2,n1,n2;
var arr=new Array('i');
var num=new Array();
var j=0,k=0;
var num1,num2;
var arr2=new Array('j');
var arr3=new Array('k');
var a1,aa1,aa2,aa3,aa4,a2,a3,a4,a5,a6,a7,a8,a9,a0,num1,num2,op;
//function first(){	
function b1v(){
	a1=parseInt(document.getElementById('b1').value);
	alert(a1);
	document.getElementById('display').value=a1;
	//i=i+1;
}
function b2v(){
	a2=parseInt(document.getElementById('b2').value);
	document.getElementById('display').value=a2;
	alert(a2);
}
function b3v(){
	a3=parseInt(document.getElementById('b3').value);
	document.getElementById('display').value=a3;
	alert(a3);
}
function b4v(){
	a4=parseInt(document.getElementById('b4').value);
	document.getElementById('display').value=a4;
	alert(a4);
}
function b5v(){
	arr[i]=parseInt(document.getElementById('b5').value);
	document.getElementById('display').value=arr;
	alert(arr);
	i=i+1;
}
function b6v(){
	arr[i]=parseInt(document.getElementById('b6').value);
	document.getElementById('display').value=arr;
	alert(arr);
	i=i+1;}
function b7v(){
	arr[i]=parseInt(document.getElementById('b7').value);
	document.getElementById('display').value=arr;
	alert(arr);
	i=i+1;
}
function b8v(){
	arr[i]=parseInt(document.getElementById('b8').value);
	document.getElementById('display').value=arr;
	alert(arr);
	i=i+1;
}
function b9v(){
	arr[i]=parseInt(document.getElementById('b9').value);
	document.getElementById('display').value=arr;
	alert(arr);
	i=i+1;
}
function b0v(){
	arr[i]=parseInt(document.getElementById('b0').value);
	document.getElementById('display').value=arr;
	alert(arr);
	i=i+1;
}
function operatord(){
	num1=a1+a2+a3+a4;
	n1=parseInt(num1);
	alert(n1);
	arr2[j]=document.getElementById('ope1').value;
	document.getElementById('display').value=num1+arr2;
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
}
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
}
function operatorp(){
	num1=a1+a2+a3+a4;
	n1=parseInt(num1);
	alert(n1);
	arr2[j]=document.getElementById('ope1').value;
	document.getElementById('display').value=num1+arr2;
	alert(arr2);
	op=arr2[j];
	j=j+1;	//ans=num1 + num2;
	//document.getElementById('display').value=ans;
}
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
	num1=a1+a2+a3+a4;
	n1=parseInt(num1);
	alert(n1);
	arr2[j]=document.getElementById('ope1').value;
	document.getElementById('display').value=num1+arr2;
	alert(arr2);
	op=arr2[j];
	j=j+1;	
	//document.getElementById('display').value=ans;
}
	//ans = num1 + num2;
	//document.getElementById('display').value=ans;
function b1v2(){
	aa1=parseInt(document.getElementById('b1').value);
	alert(aa1);
	document.getElementById('display').value=aa1;
}
function b2v2(){
	aa2=parseInt(document.getElementById('b1').value);
	alert(aa2);
	document.getElementById('display').value=aa2;
}
function b3v2(){
	aa3=parseInt(document.getElementById('b1').value);
	alert(aa3);
	document.getElementById('display').value=aa3;
}
function b4v2(){
	aa4=parseInt(document.getElementById('b1').value);
	alert(aa4);
	document.getElementById('display').value=aa4;
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

//}
function calculations(){
//alert(arr);
num2=aa1+aa2aa3+aa4;
n2=parseInt(num2);
alert(num1);
alert(n1);
alert(num2);
alert(n2);
//num1=(arr);
//num2=(arr3);
//alert(num+num2);
//num1.toString();
//var n1=parseInt(num1);
//alert(n1);
alert(arr2);
//alert(num2);
//var n2=parseInt(num2);
//alert(n2);

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