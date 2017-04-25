#include <iostream.h>
#include <conio.h>
//#include <string.h>
using namespace std;
union d{
      int a;
      char h;
      };
      int main()
      {
          d k;
          cout<<"enter the digit";
          cin>>k.a;
          cout<<"enter the character";
          cin>>k.h;
          cout<<k.h;
          cout<<k.a; 
          getch();
          }






















