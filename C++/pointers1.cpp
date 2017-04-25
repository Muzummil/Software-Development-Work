#include <iostream>
#include <conio.h>
using namespace std;
int main()
{
    int i;
    char j;
    int *p;
    char *s;
    i=24;
    j='a';
    p=&i;
    s=&j;
    cout<<*p<<endl;
    cout<<p<<endl;
    cout<<s<<endl;
    getch();
}
