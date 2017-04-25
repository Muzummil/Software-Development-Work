0#include <iostream>
#include <conio.h>
using namespace std;
class calculator{
	protected:
		int num1,num2;
	public:
		~calculator()
		{
		}
		void setnum()
		{
			cout<<"enter num1 and num2";
			cin>>num1>>num2;
		}
		int add()
		{
			int add1;
			add1=num1+num2;
			cout<<"sum of"<<num1<<"and "<<num2<<"is="<<add1<<endl;
			return add1;
		}
		int division()
		{
			int d1;
			d1=num1/num2;
			cout<<"division of"<<num1<<"and"<<num2<<"is="<<d1<<endl;
			return d1;
		}
};
int main()
{
	calculator c1;
	calculator();
	c1.setnum();
	c1.add();
	c1.division();
	//~calculator();
getch();
}


