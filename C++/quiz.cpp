#include <iostream.h>
#include <conio.h>
using namespace std;
int result(int num,int power);
int main()
{
int num,power;
cout<<"enter number";
cin>>num;
cout<<"enter power";
cin>>power;
cout<<"ans"<<result(num,power);
getch();
}
int result(int num,int power)
{
int i=1;
int result=1;
while(i<=power)
{
result=result*num;
i++;
}
return result;
}
