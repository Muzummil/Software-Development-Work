#include <iostream.h>
#include <conio.h>
using namespace std;
int main()
{
int number,choice;
cout<<"ENTER NUMBER OF WHICH TABLE U WANT";           
cin>>choice;      
for(number=1;number<=20;number++)
{                                                       
cout<<choice<<"x"<<number<<"="<<choice*number<<endl;
}
getch(); 
}
