#include <conio.h>
#include <iostream.h>

using namespace std;

class divide{
      public:
             divide ()
             {
             }
             };
int qou(int a,int b)
{
    if(b==0)
    {
            throw divide();
}
return a/b;
}
void getnum(int &a,int &b)
{
     cout<<"enter value";
     cin>>a>>b;
     }
     void qo(int a,int b,int q)
     {
          cout<<"quient of"<<a<<"and"<<b<<"is"<<q;
          }
int main()
{
    int x,y,qu;
    for(int i=0;i<5;i++)
    {
            try{
                getnum(x,y);
                qu=qou(x,y);
                qo(x,y,qu);
                }
                catch(divide)
                {
                    i--;
                    cout<<"attempted divide";
                    }
                    }
                    getch();
}
