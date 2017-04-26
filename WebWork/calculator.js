function func1(){
var firstnum;
var secondtnum;
var op;
var ans;
firstnum=document.getElementById('first').value;
op=document.getElementById('first').value;
secondtnum=document.getElementById('first').value;
if(op=='+'){
ans=firstnum+secondtnum;
alert(ans);
}
else if(op=='-'){
ans=firstnum-secondtnum;
alert(ans);
}
else if(op=='*'){
ans=firstnum*secondtnum;
alert(ans);
}
else if(op=='/'){
ans=firstnum/secondtnum;
alert(ans);
}

}