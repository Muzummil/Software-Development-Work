#include <iostream>
#include <conio.h>
using namespace std;
int main()
{
double dollar,euro,rupee,attempts=0;                //variable declaration
char c,d;                                            //character declaration  
cout<<"\nWELCOME TO MUZUMMIL IQBAL'S CURRENCY CONVERTOR\n";
do                                                    //repitation
{
cout<<"\n,1)PRESS A FOR CONVERTING DOLLAR INTO RUPEE\n,2)PRESS B FOR CONVERTING EURO INTO RUPEE\n,3)PRESS C FOR CONVERTING RUPEE INTO DOLLAR\n,4)PRESS D FOR CONVERTING RUPEE INTO EURO\n,5)PRESS E FOR CONVERTING DOLLAR INTO EURO\n,6)PRESS F FOR CONVERTIBG EURO INTO DOLLAR\n";                                  //giving user choice to salect operation which he want
cin>>c;                                                 //read a character
if(c=='a'||c=='A')                                       //conditioin
{
cout<<"enter amount in dollar which you want to convert in rupee";       //giving user a chance to enter value which he want
cin>>dollar;                                                               //read user's value
rupee=dollar*50;                                                         //formula
cout<<"amount converted in rupee ="<<rupee<<endl;                     //show result
attempts=6;                                                                  //ending of condition
}
if(c=='b'||c=='B')
{
cout<<"enter amount in euro which you want to convert into rupee";             //giving user a chance to enter value which he want
cin>>euro;                                         //read user's value
rupee=euro*100;                                                      //read user's value
cout<<"amount converted into rupee ="<<rupee<<endl;
attempts=6;                                                 //ending of condition
}
if(c=='c'||c=='C')
{
cout<<"enter amount in rupee which you want to convert into dollar";                      //giving user a chance to enter value which he want
cin>>rupee;                                                                             //read user's value
dollar=rupee/50;                                                //read user's value
cout<<"amount converted into dollar ="<<dollar<<endl;             //show result
attempts=6;                                                          //ending of condition
}
if(c=='d'||c=='D')
{
cout<<"enter amount in rupee which you want to convert into euro";     //giving user a chance to enter value which he want
cin>>rupee;                                                                 //read user's value
euro=rupee/100;                                                                //read user's value
cout<<"amount converted into euro ="<<euro<<endl;                             //show result
attempts=6;                                                                   //ending of condition
}
if(c=='e'||c=='E')
{
cout<<"enter amount in dollar which you want to convert into euro";                     //giving user a chance to enter value which he want
cin>>dollar;                                                              //read user's value
euro=dollar/2;                                                //read user's value
cout<<"amount converted into euro ="<<euro<<endl;                           //show result
attempts=6;                                         //ending of condition
}
if(c=='f'||c=='F')
{
cout<<"enter amount in euro which you want to convert into dollar";             //giving user a chance to enter value which he want
cin>>euro;                                                                     //read user's value
dollar=euro*2;                                                                       //read user's value
cout<<"amount converted into dollar ="<<dollar<<endl;                            //show result
attempts=6;                                                                       //ending of condition
}
cout<<"\npress y to continue convertor and press n to exit\n";            //give user an option to use again or exit
cin>>d;                                                                   //take user's instructions of using or not
if(d=='n'||d=='N')                                                         //codition
{
cout<<"****THANK YOU FOR USING MUZUMMIL IQBAL'S CONVERTOR ALLAH HAFIZ****";            //show result
attempts=50;
}
if(d=='y'||d=='Y')                                                        //condition
{
attempts=attempts+1;
}
}
while(attempts<=30);
getch();                                                                //end of programm
}
