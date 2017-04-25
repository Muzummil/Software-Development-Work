#include <iostream>
#include<conio.h>
using namespace std;
class name{
	char myname[10];
	public:
		void setname();
		void display();
};
void name::setname()
{
	char n[10];
	for(int i=0;i<10;i++)
	{
		cout<<"enter element"<<i+1<<"of array";
		cin>>n[10];
	}
	myname[10]=n[10];
}
void name::display()
{
	cout<<"array is";
	for(int i=0;i<10;i++)
	{
		cout<<myname[10];
	}
}
int main()
{
	name d1;
	d1.setname();
	d1.display();
getch();
}
