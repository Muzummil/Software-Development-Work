#include <iostream.h>
#include <math.h>
#include <conio.h>
using namespace std;
int main()
{
float x,digit1,digit2;
char c,error;
cout<<"[WELCOME TO MUZUMMIL CALCULATOR VERSION 1.0]\n"<<endl;
cout<<",1)press m or M for multiplication\n,2)press a or A for addition\n,3)press s or S for subtraction\n,4)press d or D for division\n,5)press w or W for modulas\n,6)press q or Q for square\n,7)press u or U for underroot\n"<<endl;
cin>>c;
if(c=='q'||c=='Q')
{
cout<<"enter x for square";
cin>>x;
cout<<x*x;
}                  
if(c=='M'||c=='m')
{     
cout<<"enter digit1    \n";
cin>>digit1;
cout<<"enter digit2    \n";
cin>>digit2;    
cout<<digit1*digit2;
}
if(c=='a'||c=='A')
{
cout<<"enter digit1    \n";
cin>>digit1;
cout<<"enter digit2    \n";
cin>>digit2;            
cout<<digit1+digit2;
}
if(c=='S'||c=='s')
{
cout<<"enter digit1    \n";
cin>>digit1;
cout<<"enter digit2    \n";
cin>>digit2;  
cout<<digit1-digit2;
}
if(c=='d'||c=='D')
{
cout<<"enter digit1    \n";
cin>>digit1;
cout<<"enter digit2    \n";
cin>>digit2;
cout<<digit1/digit2;
}
if(c=='W'||c=='w')
{
int digit1,digit2; 
cout<<"enter digit1    \n";
cin>>digit1;
cout<<"enter digit2    \n";
cin>>digit2;
cout<<digit1%digit2;
}
if(c=='u'||c=='U')
{
double number,y;             
y=sqrt(number);                  
cout<<"enter a number for under root";
cin>>number; 
cout<<"ans"<<y;       
}
if(c!='a'||'A'||'d'||'D'||'s'||'S'||'w'||'W'||'u'||'U'||'m'||'M')
{
cout<<"enter valid character for above mentioned operations"<<error;
}                 
getch();   
}
