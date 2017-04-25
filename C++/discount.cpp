#include <iostream.h>
#include <conio.h>
using namespace std;
int main()
{
int amount,discount,amount1,amount2,amount3,totalamount,netamount;
amount=5000;
cout<<"enter amount1";
cin>>amount1;
cout<<"enter amount2";
cin>>amount2;
cout<<"enter amount3";
cin>>amount3;
totalamount=amount1+amount2+amount3;
if(totalamount>amount)
{
discount=5000*25/100;
netamount=totalamount-discount;
cout<<"amount after discount is="<<discount;
cout<<"netamout"<<netamount;
}
else
{
discount=5000*10/100;
netamount=totalamount-discount;
cout<<"amount after discount is="<<discount;
cout<<"netamount"<<netamount;
}
getch();                                                  
}
