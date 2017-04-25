#include <iostream>
#include <conio.h>
using namespace std;
int main()
{
    int i;
    int s;
    int array[5];
    for(i=0;i<5;i++)
    {
         cout<<"enter numbers"<<i+1;
         cin>>array[i];
    }
    cout<<"press number to search";
    cin>>s;
    for(int j=1;j<=5;j++)
    {       
      if(s==array[j])
       {   
         cout<<"ur number"<<s<<"is at index"<<j;
         }
        }
getch();  
}
