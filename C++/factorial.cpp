#include <iostream.h>
#include <conio.h>
using namespace std;
int main()
{
long double factorial,number;
factorial=1;
cout<<"enter number\n";
cin>>number;
while(number>1)
{
factorial=factorial*number;
number--;
}
cout<<factorial;
getch();    
}
