#include <iostream>
#include <conio.h>
using namespace std;
struct date{
       short day;
       short month;
       short year;
       };
struct time{
       short second;
       short minut;
       short hour;
    struct date x;
       };
int main()
{
time d1={0,1,2,3,4,5};
//cout<<"enter day";
//cin>>d1.x.day;
//cout<<"enter month";
//cin>>d1.x.month;
//cout<<"enter second";
//cin>>d1.second;
cout<<d1.x.day<<endl;
cout<<d1.x.month<<endl;
cout<<d1.second<<endl;
getch();
}  
