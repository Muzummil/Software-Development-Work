#include <iostream>
#include <conio.h>
using namespace std;
int main()
{
	int d,i,j,k,array[5];
for(i=0;i<5;i++)
{
cout<<"enter number"<<i+1<<"of array";
cin>>array[i];
}
for(i=0;i<6;i++)
{
	for(j=0;j<5;j++)
	{
	if(array[j]>array[j+1])
	{
		int k;
		k=array[j];
		array[j]=array[j+1];
		array[j+1]=k;
}
	}		
}
for(i=0;i<5;i++)
{
	cout<<array[i];
}
cout<<"enter element to search in array";
cin>>k;
for(i=0;i<5;i++)
{
	//cout<<array[i];
if(array[i]==k)
{
	d=1;
	break;
}
}
if(d==1)
{
	cout<<"number is found at index "<<i;
}
else
{
	cout<<"number not found";
}
getch();
}
