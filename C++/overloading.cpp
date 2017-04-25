#include <iostream.h>
#include <conio.h>
using namespace std;
void func(int x=8,float y=7.8)
{
 cout<<x<<endl;
 cout<<y;    
}
int main()
{
    func();
    func(5,9.1);
    func(6.7,9);
getch();
}

