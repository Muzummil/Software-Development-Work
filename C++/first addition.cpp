#include <iostream>
#include <conio.h>
using namespace std;
int main()
{
short age1,age2,age3,age4,age5;
short totalage;
short average;
cout<<"please enter the age of first student";
cin>>age1;
cout<<"please enter the age of second student";
cin>>age2;
cout<<"please enter the age of third student";
cin>>age3;
cout<<"please enter the age of fourth student";
cin>>age4;
cout<<"please enter the age of fifth student";
cin>>age5;
totalage=age1+age2+age3+age4+age5;
average=totalage/5;
cout<<"average of students is="<<average;
getch();
}
