#include <iostream>
#include <conio.h>
using namespace std;
int res(int num);
int main()
{
int num,res;
cout<<"enter num";
cin>>num;
res=num%2;
if(res==0)
{
cout<<"even";
res=num%2;
cout<<"even";
res=num%2;
}
else
{
cout<<"odd";
res=num%2;
}
getch();
}
int res(int num)
{
    int res;
    res=num%2;
    return res;
}
