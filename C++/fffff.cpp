#include <iostream.h>
#include <conio.h>
using namespace std;
int add(float ,float );
int main()
{
float x,y;
cout<<"enter x";
cin>>x;
cout<<"enter y";
cin>>y;
cout<<add(x,y);
getch();
}
int add(float a,float b)
{
    float add;
    add=a+b;
    return add;
}
