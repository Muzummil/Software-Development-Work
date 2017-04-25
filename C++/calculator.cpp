#include <iostream>
#include <conio.h>
using namespace std;
int main()
{
int digit1,digit2;
char c,error;
cout<<"[WELCOME TO MUZUMMIL CALCULATOR]\n"<<endl;
cout<<",1)press m for multiplication\n,2)press a for addition\n,3)press s for subtraction\n,4)press d for division\n,5)press w for modulas\n"<<endl;
cin>>c;
cout<<"enter digit1    \n";
cin>>digit1;
cout<<"enter digit2    \n";
cin>>digit2;
if(c=='M'||c=='m')
{         
cout<<digit1*digit2;
}
if(c=='a'||c=='A')
{          
cout<<digit1+digit2;
}
if(c=='S'||c=='s')
{
cout<<digit1-digit2;
}
if(c=='d'||c=='D')
{
cout<<digit1/digit2;
}
if(c=='W'||c=='w')
{
cout<<digit1%digit2;
}   
if(c!='a'||'A'||'s'||'S'||'m'||'M'||'d'||'D')
{
cout<<error;
}  
getch();  
}                
