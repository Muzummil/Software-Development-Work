#include <iostream>
#include <conio.h>
using namespace std;
int main()
{
int size=5;
int array[size];
//cout<<"enter size of array";
//cin>>size;
for(int i=0;i<size;i++)
{
	cout<<"enter elements of array";
	cin>>array[i];
	}
    for(int i=0;i<size;i++)
    {
            for(int j=0;j<size-1;j++)
            {
	if(array[i]>array[i+1])
		{
		int c;
		c=array[i];
		array[i]=array[i+1];
		array[i+1]=c;
for(int i=0;i<size;i++)
	{
            cout<<array[i]<<endl;
            }	
    }
	
}
}
getch();
}

