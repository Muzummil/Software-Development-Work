#include <iostream>
#include <math.h>
#include <conio.h>
using namespace std;
double underroot(double sqrt,double number);
int main()
{
   double n,u;
   underroot(u,n);
   getch();
   }
   double underroot(double sqrt,double number)
   {
    double underroot; 
	cout<<"enter number";
   cin>>number;
   underroot=sqrt(number);
   cout<<"underroot"<<underroot;     
   return underroot;
}
