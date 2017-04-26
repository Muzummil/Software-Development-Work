function func1(){
var firstnum;
var secondnum;
var op;
var ans;
var sol;
firstnum=parseFloat(document.getElementById('first').value);
op=document.getElementById('operator').value;
secondnum=parseFloat(document.getElementById('second').value);
switch(op){
case "+":
ans=firstnum+secondnum;
document.getElementById('output').value=firstnum+op+secondnum+'='+ans;
break;
case "-":
ans=firstnum-secondnum;
document.getElementById('output').value=firstnum+op+secondnum+'='+ans;
break;
case "*":
ans=firstnum*secondnum;
document.getElementById('output').value=firstnum+op+secondnum+'='+ans;
break;
case "/":
ans=firstnum/secondnum;
document.getElementById('output').value=firstnum+op+secondnum+'='+ans;
break;
defualt:
document.write("in valid operator");
}
}