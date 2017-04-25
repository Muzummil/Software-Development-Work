#include <iostream>
#include <math.h>
#include <conio.h>
using namespace std;
int main()
{
float x,a,digit1,digit2,tries=0,z;
char c,d;
do
{
cout<<"\nWELCOME TO MUZUMMIL CALCULATOR VERSION 1.0]\n"<<endl;
cout<<",1)press m or M for multiplication\n,2)press a or A for addition\n,3)press s or S for subtraction\n,4)press d or D for division\n,5)press w or W for modulas\n,6)press q or Q for square\n,7)press u or U for underroot\n,7)enter t for scintific calculator"<<endl;
cin>>c;
if(c=='t')
{
cout<<"\n****WELCOME TO MUZUMMIL IQBAL'S SCINTIFIC CALCULATOR****\n";
double angle;
cout<<"enter angle to find sin,cos and tan values of your angle";
cin>>angle;
cout<<"sin(angle)=\n"<<sin(angle);
cout<<"\ncos(angle)=\n"<<cos(angle);
cout<<"\ntan(angle)=\n"<<tan(angle);
tries=4;
}
if(c=='q'||c=='Q')
{
cout<<"enter x for square";
cin>>x;
cout<<x*x;
tries=4;
}                  
if(c=='M'||c=='m')
{     
cout<<"enter digit1    \n";
cin>>digit1;
cout<<"enter digit2    \n";
cin>>digit2;    
cout<<digit1<<"*"<<digit2<<"="<<digit1*digit2;
tries=4;
}
if(c=='a'||c=='A')
{
int a,digit1,digit2;                  
cout<<"enter digit1    \n";
cin>>digit1;
cout<<"enter digit2    \n";
cin>>digit2;            
cout<<digit1<<"+"<<digit2<<"="<<digit1+digit2<<endl;
tries=4;
}
if(c=='S'||c=='s')
{
cout<<"enter digit1    \n";
cin>>digit1;
cout<<"enter digit2    \n";
cin>>digit2;  
cout<<digit1<<"-"<<digit2<<"="<<digit1-digit2;
tries=4;
}
if(c=='d'||c=='D')
{
cout<<"enter digit1    \n";
cin>>digit1;
cout<<"enter digit2    \n";
cin>>digit2;
cout<<digit1<<"/"<<digit2<<"="<<digit1/digit2;
tries=4;
}
if(c=='W'||c=='w')
{
int digit1,digit2,tries; 
cout<<"enter digit1    \n";
cin>>digit1;
cout<<"enter digit2    \n";
cin>>digit2;
cout<<digit1<<"%"<<digit2<<"="<<digit1%digit2;
tries=4;
}
if(c=='u'||c=='U')
{
double number,y;                              
cout<<"enter a number for under root\n";
cin>>number; 
y=sqrt(number); 
cout<<"under root of"<<number<<"="<<y;       
tries=4;
}
else
{
cout<<"enter valid character";
tries=4;
}
cout<<"\nenter y to continue again and n to exit";
cin>>d;
if(d=='n'||d=='N')
{
cout<<"thank u for using calculator bye";
tries=300;
}
if(d=='y'||d=='Y')
{
tries=tries+1;
}
}
while(tries<=100);    
getch();   
}
