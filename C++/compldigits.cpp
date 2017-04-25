#include <iostream.h>
#include <conio.h>
using namespace std;
int main()
{
int number,digit1,digit2,digit3,digit4;
number=5697;
digit1=number%10;
number=number/10;
digit2=number%10;
number=number/10;
digit3=number%10;
number=number/10;
digit4=number%10;
cout<<digit1<<"\n";
cout<<digit2<<"\n";
cout<<digit3<<"\n";
cout<<digit4<<"\n";
getch();
}
