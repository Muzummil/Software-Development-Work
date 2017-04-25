#include <iostream.h>
#include <conio.h>
using namespace std;
const int size=4; 
int modify(int [],int );
union d{
      int i;
      char c;
      };
      
int main()
{ 
 int a[size]={0,1,2,3};
 modify(a,4);
 for(int z=0;z<size;z++)
 {
         cout<<a[z];  
}
d x;
x.i=5;
cout<<x.i;
x.c='m';
cout<<x.c;
getch();    
}
int modify(int b[],int size)
{
   for(int k=0;k<size;k++)
   {
       b[k]=b[k]+1;
       cout<<b[k];
       }      
}     
