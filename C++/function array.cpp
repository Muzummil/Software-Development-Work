#include <iostream>
//#include <conio.h>
using namespace std;
void f(int [],int );
void j(int[],int );
//void add(int );
int main()
{
int array[4]={2,3,4,5};
for(int i=0;i<4;i++)
{
        cout<<array[i]<<endl;
}
j(array,6);
f(array,5);


}
void f(int array1[], int size)
{
     for(int i=0;i<size;i++)
     {
     cout<<"enter array1 and element number"<<i<<endl;
     cin>>array1[i];
     cout<<array1[i]<<endl;
     }
}

void j(int array2[],int size)
{
     for(int i=0;i<size;i++)
     {
     cout<<"enter array2"<<endl;
     cin>>array2[i];
     cout<<array2[i];
     if(array2[i]==3)
     {
                     int a;
                     while(a<4)
                     cout<<"error";
                     break;
                     }
     }
}
     

