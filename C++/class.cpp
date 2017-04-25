// stringin.cpp
// simple string variable
#include <iostream>
#include <conio.h>
using namespace std;
int main()
{
//const int MAX = 80; //max characters in string
string str;//str[MAX];
cout <<"Enter a string: ";
cin >> str; //put string in str
//display string from str
cout << "You entered:" << str << endl;
getch();
return 0;
}
