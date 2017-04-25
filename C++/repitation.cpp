#include <iostream.h>
#include <conio.h>
using namespace std;
int square();
int main()
{
int num,res;
cout<<"enter number";
cin>>num;
res=num*num;
cout<<"square of number"<<res<<endl;
cout<<"enter number";
cin>>num;
res=num*num;
cout<<"square of number"<<res;
getch();
}
int square(int num)
{
int res;
res=num*num;
return res;
}
