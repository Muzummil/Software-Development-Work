#include <conio.h>
#include <iostream.h>
using namespace std;
int main()
{
  int i,j;
for(i=0;i<=5;i++)
{
     for(j=0;j<=i;j++)
     cout<<"\t"<<j*j;
     cout<<"\n";
     }
     getch();            
}
