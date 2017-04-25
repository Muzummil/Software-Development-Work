#include <iostream.h>
#include <stdlib.h>
#include <conio.h>
using namespace std;
int main()
{
   int num[100];
   int a;
   int i;
   int b=0;
   for(i=0;i<100;i++)
   {
    num[i]=rand();
    ;
    }                 
    cout<<"enter number to search from array";
    cin>>a;
    for(i=0;i<100;i++)
    {
          if(num[i]==a)
          {
          b=1;
          break;
          }             
}
      if(b==1)
      {
            cout<<"number is at index"<<i;
            }
            else
            {
                cout<<"number not found";
                }
getch();
}  

