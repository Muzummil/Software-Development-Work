#include <iostream>
#include <conio.h>
//#include <string.h>
using namespace std;
struct student{
       char *name;
       int rollno;
       char degree[5];
       };
int main()
{
student s1;//={"ali",19,"bs"};
//student s2;
s1.name="ali";
cout<<s1.name<<endl;
cout<<"enter ur name";
cin>>s1.name;
//cout<<"enter ur roll#\n";
//cin>>s2.rollno;
cout<<"enter degree";
cin>>s1.degree;
cout<<s1.name<<endl;
cout<<s1.rollno<<endl;
cout<<s1.degree<<endl;
//cout<<s2.name;
//cout<<s2.rollno;
//cout<<s2.degree;
//cout<<sizeof(s2.name);
getch();
}
