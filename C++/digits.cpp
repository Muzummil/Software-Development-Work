#include <iostream.h>
#include <conio.h>
using namespace std;
int main()
{
int number,number1,number2,digit1,digit2,digit3,digit4;
number=5697;
digit1=number%10;
number=number/10;
digit2=number%10;
number=number/10;
digit3=number%10;
number=number/10;

digit4=number/10;
cout<<"\nnumber%10 is=\n"<<digit1;
cout<<"\nnumber%10 is=\n"<<digit2;
cout<<"\nnumber%10 is=\n"<<digit3;
cout<<"\nnumber/10 is=\n"<<digit4;
getch();
}
