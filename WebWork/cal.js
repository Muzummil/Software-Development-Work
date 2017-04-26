function func1(){
var firstnum=2;
var secondnum=3;
var op;
var ans;
var sol;
firstnum=parseFloat(document.getElementById('first').value);
op=document.getElementById('operator').value;
secondnum=parseFloat(document.getElementById('second').value);
if(op=="+"){
ans=firstnum + secondnum;
document.getElementById('output').value=firstnum+op+secondnum+'='+ans;
}
else if(op=='-'){
ans=firstnum - secondnum;
document.getElementById('output').value=firstnum+op+secondnum+'='+ans;
}
else if(op=='*'){
ans=firstnum*secondnum;
document.getElementById('output').value=firstnum+op+secondnum+'='+ans;
}
else if(op=='/'){
ans=firstnum/secondnum;
document.getElementById('output').value=firstnum+op+secondnum+'='+ans;
}
}