#include <iostream>
#include <conio.h>
using namespace std;
void starline(char ,int );
int main()
{
starline('*',45);// call to function
cout << "Data type Range"<< endl;
starline('+',45); //call to function
starline('+',45); 
cout << "char -128 to 127" << endl
<< "short -32,768 to 32,767" << endl
<< "int System dependent"<< endl
<< "long -2,147,483,648 to 2,147,483,647" << endl;
starline('&',45); //call to function
getch();
}
//--------------------------------------------------------------
// starline()
// function definition
void starline(char c,int n) //function declarator
{
for(int j=0; j<n; j++) //function body
cout <<c;
cout <<endl;
}
