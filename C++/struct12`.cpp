#include <iostream>
#include <conio.h>
#include <string.h>
using namespace std;
struct student{
       char name;
       int rollno;
       char degree;
       };
int main()
{
student s2,s1={'b',19,'v'};
s2=s1;
//cout<<"enter ur name";
//cin>>s2.name;
//cout<<"enter ur roll#\n";
//cin>>s2.rollno;
//cout<<"enter degree";
//cin>>s2.degree;
cout<<s1.name<<endl;
cout<<s1.rollno<<endl;
cout<<s1.degree<<endl;
cout<<s2.name<<endl;

cout<<s2.rollno<<endl;
cout<<s2.degree<<endl;
//cout<<sizeof(s2.name);
getch();
}
