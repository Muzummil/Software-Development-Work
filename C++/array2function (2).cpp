#include <iostream>
#include <conio.h>
using namespace std;
const int size=5;
void func(int a[]);
int main()
{
       int a[5];
func(a);
cout<<"array in main";
for(int m=0;m<size;m++)
{
        cout<<a[m];
        }
getch();
}
void func(int a[size])
{
     for(int i=0;i<size;i++)
     {
             cout<<"enter element";
             cin>>a[i];
             }
             for(int j=0;j<size;j++)
             {
                     cout<<a[j]+1;
                     }
}
