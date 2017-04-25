#include <iostream>
#include <conio.h>
using namespace std;
void f(int& );
int main()
{
int i;
cout<<"enter i";
cin>>i;
f(i);
cout<<i<<endl;
getch();
}
void f(int &a)
{
     a=a*3;
     cout<<a<<endl;
     }
