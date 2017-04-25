#include <iostream.h>
#include <conio.h>
using namespace std;
class time{
      private:
      int hours;
      int minuts;
      int seconds;
      public:
             void changehours(int );
             void changeminuts(int );
             void changeseconds(int );
             void display();
      };
  void time::changehours(int ho)
  {
       hours=ho;
       }
       void time::changeminuts(int mi)
       {
            minuts=mi;
            }
            void time::changeseconds(int se)
            {
                 seconds=se;
                 }
                 void time::display()
                 {
                      cout<<"time is"<<hours<<minuts<<seconds;
                      }
int main()
{
time d;
    d.changehours(3);
    d.changeminuts(25);
    d.changeseconds(56);
    d.display();
 getch();
}          
