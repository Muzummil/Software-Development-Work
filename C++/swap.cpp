#include <iostream.h>
#include <conio.h>
using namespace std;
int swap(int &x,int &y);
int main()
{
int a,b;
cout<<"enter a";
cin>>a;
cout<<"enter b";
cin>>b;
swap(a,b);
cout<<"value of a"<<a<<"value of b"<<b;
getch();
}
int swap(int &x,int &y)
{
    int z;
z=x;
x=y;
y=z;
return x,y;
}

