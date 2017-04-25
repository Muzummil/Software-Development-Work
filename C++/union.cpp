#include <iostream.h>
#include <conio.h>
#include <string.h>
using namespace std;
union a{
      int i;
      char c;
      };
int main()
{
    a k;
    cout<<"enter an integer value"<<"\n";
    cin>>k.i;
    cout<<"enter a character value"<<"\n";
    cin>>k.c;
    cout<<k.i<<endl;
    cout<<k.c;
    getch();
}
