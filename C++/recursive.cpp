#include <iostream>
#include <conio.h>
using namespace std;
long long fact(int number);
int main()
{
    int number;
    cout<<"enter number of factorial";
    cin>>number;
    cout<<"factorial is"<<fact(number);
    getch();
}
long long fact(int number)
{
  if(number<=1)
  {
  return 1;
  }
  else
  {

    return  number*fact(number-1);
  }
}
