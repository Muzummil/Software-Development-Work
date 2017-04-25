#include<iostream>
#include<conio.h>
using namespace std;
int exp(int num, int pow)
{
	int res=1;
	for(int i=0; i<pow;i++)
	
	{
		res=res*num;
	}
	return res;
}
int square()
	{
		int a;
		cout<<"please enter number to get its square"<<endl;
		cin>>a;
		int result=0;
		result=a*a;
		cout<<result;
		return result;
	}
	void swap(int &x,int &y)
	{
		int z=0;
		z=x;
		x=y;
		y=z;
		cout<<"first number after swaping is="<<x<<endl;
		cout<<"second number after swaping is="<<y<<endl;
		
	}
	
int main()
{
	int num,num1,res,x,y;
	cout<<"plz enter num";
	cin>>num;
cout<<"plz enter pow";
	cin>>num1;
	res=exp(num,num1);
	cout<<"your result is="<<res<<endl;
	square();
	cout<<"\nenter first number for swaping";
	cin>>x;
	cout<<"enter second number for swaping";
	cin>>y;	
	swap(x,y);
	
	getch();
}



