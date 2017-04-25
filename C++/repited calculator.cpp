#include <iostream>
#include <conio.h>
using namespace std;
int a(int digit1,int digit2);
int main()
{
int digit1,digit2,a;
cout<<"enter digit1\n";
cin>>digit1;
cout<<"enter digit2\n";
cin>>digit2;
cout<<"addition\n"<<a<<endl;
cout<<"enter digit1\n";
cin>>digit1;
cout<<"enter digit2\n";
cin>>digit2;
cout<<"addition\n"<<a<<endl;
getch();
}
int a(int digit1,int digit2)
{
int a;
a=digit1+digit2; 
return a;
}    
