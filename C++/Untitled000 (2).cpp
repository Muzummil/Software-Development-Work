#include <iostream.h>
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
                day=0;
                month=0;
       year=0;
       }          
void date::setaday()
{
     int aday;
   cout<<"enter day";
   cin>>aday;  
day=aday;
}
void date::setamonth()
{
     int amonth;
     cout<<"enetr month";
     cin>>amonth;
     month=amonth;
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
    date d1;
    d1.display();
    date d2;
   d2.setaday();
    d2.setamonth();
    d2.setayear();
    d2.display();
    getch();
}
