#include <iostream>
#include <conio.h>
using namespace std;
int f(int);
void j(int);
int main()
{
int i;
cout<<"enter i";
cin>>i;
cout<<f(i);
j(i);
getch();
}
int f(int a)
{
     a=a*2;
    // cout<<a<<endl;
    return a;
     }
void j(int x)
{
	int a;
        a=x+1;
        cout<<a;
}
