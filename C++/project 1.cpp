#include <iostream.h>
#include <conio.h>
using namespace std;
int f(int ,int );
int main()
{
float x,y;

cout<<"enter x \n";
cin>>x;
cout<<"enter y \n";
cin>>y;
cout<<"\nAddition is \n"<<f(x,y);
cout<<"\nenter x \n";
cin>>x;
cout<<"enter y \n";
cin>>y;
cout<<"Addition is \n"<<f(x,y)<<endl;
getch();
}
int f(int a,int b)
{
    float sum;
    sum=a+b;
   //return sum;
    return sum;
}
