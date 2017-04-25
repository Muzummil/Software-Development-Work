#include <iostream>
#include <conio.h>
#include <string.h>
using namespace std;
struct time{
	short second,minut;
	string h;  
};
struct date{
	int day;
	int month,year;
	time x;
};
int main()
{
	date d1;
	d1.x.h=="muzummil";
	cout<<"name 1 is"<<d1.x.h;
	cout<<"enter your name";cin>>d1.x.h;
	cout<<"name 2 is"<<d1.x.h;
	cout<<"enter second";
	cin>>d1.x.second;
	cout<<"enter day";
	cin>>d1.day;
	cout<<"enter minut";
	cin>>d1.x.minut;
	cout<<"enter year";cin>>d1.year;
	cout<<d1.x.second<<endl;
	cout<<"year is"<<d1.year;
	cout<<"minut is"<<d1.x.minut;
	cout<<d1.day;
	getch();
}
