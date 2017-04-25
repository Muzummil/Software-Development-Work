#include <iostream>
#include <conio.h>
//Hammad Ashraf 
//Roll No.14-arid-1407
using namespace std;

int main()
{
int x;
int choice;
int amount=0;
char choice1,choice2,choice3;
do
{
cout<<"welcome to H.A currency converter\n";
cout<<"select the currency that you want to exchange\n";
cout<<"enter r for rupee\n";
cout<<"enter e for euro\n";
cout<<"enter d for dollar\n";
cout<<"plz choose the currency that you want to convert\n";
cin>>choice1;
cout<<"plz select the currency that you want to convert into\n";
cin>>choice2;
cout<<"enter amount";
cin>>amount;
if(choice1=='r' && choice2=='e')
{
   //division of input rupee by 100 to convert into euro
cout<<amount<<"rupee="<<amount/100<<"euro"<<endl;
}
if(choice1=='r' && choice2=='d')
{
  //division of input rupee by 50 to convert into dollar
cout<<amount<<"rupee="<<amount/50<<"dollar"<<endl;
}
if(choice1=='e' && choice2=='r')
{
  //multiplication of input euro by 100 to convert into rupee
cout<<amount<<"euro="<<amount*100<<"rupee"<<endl;
}
if(choice1=='e' && choice2=='d')
{
  //multiplication of input euro by 2 to convert into dollar
cout<<amount<<"euro="<<amount*2<<"dollar"<<endl;
}
if(choice1=='d' && choice2=='r')
{
  //multiplication of input dollar by 50 to convert into rupee
cout<<amount<<"dollar="<<amount*50<<"rupee"<<endl;
}
if(choice1=='d' && choice2=='e')
{
  //division of input by 2 to convert into euro
cout<<amount<<"dollar="<<amount/2<<"euro"<<endl;
}
cout<<"do you want to make another conversion?(y/n)\n";
cin>>choice3;
}
while
(choice3=='y');
cout<<"thanks for using H.A currency converter goodbye";
getch();
}
