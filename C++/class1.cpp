#include <iostream>
#include <conio.h>
using namespace std;
class date{
      private:
              int day,month,year;
             public:
             void setaday();
             void setamonth();
             void setayear();             
             void display();
             date();
             //int getday();
             //int getmonth();
             //int getyear();
             };
     
 date::date()
 {
                day=1;
                month=1;
       year=1;
       }          
void date::setaday()
{
     int aday;
   cout<<"enter day";
   cin>>aday;
 aday=aday+2;
day=aday;
}
void date::setamonth()
{
     int amonth;
     cout<<"enetr month";
     cin>>amonth;
      if(amonth<31)
      {
     month=amonth;
     }
     else
     {
         cout<<"enter valid value";
         }
         }
void date::setayear()
{
     int j;
     cout<<"enter year";cin>>j;
     year=j;
     } 
void date::display()
{
cout<<"date is"<<day<<"-"<<month<<"-"<<year;
} 
int main()
{
    date d1,d3;
    d1++;
    d1.display();
    //d3.display();
	date d2;
   d2.setaday();
    d2.setamonth();
    d2.setayear();
    d2.display();
    getch();
}
