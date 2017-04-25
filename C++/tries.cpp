#include <iostream.h>
#include <conio.h>
using namespace std;
int main()
{
int tries=0;
char c;
do
{
cout<<"please enter a character b/w a and z";
cin>>c;
if(c=='z'||c=='Z' )
{
cout<<"congrats u guess";
tries=4;
}
if(c!='z'||'Z')
{
tries=tries+1;
}
}
while(tries<5);
getch();                   
}
