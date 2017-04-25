#include <iostream.h>
#include <conio.h>
using namespace std;
float multi(int ,int );
int main()
{
    float x,y;
    cout<<"enter x";cin>>x;
    cout<<"enter y";
    cin>>y;
    
    cout<<"ans"<<multi(x,y);
    cout<<"enter value of x";
    cin>>x;
    cout<<"enter value of y";
    cin>>y;
    
    cout<<multi(x,y); 
    getch();
}
float multi(int a,int b)
{
float m;    
    m=a*b;
     return m;
     } 
    
