#include <iostream.h>
#include <conio.h>
using namespace std;
template<class T>
class student{
	T mynumber;
	public:
	T student1(T n)
		{	
            mynumber=n;
			//cout<<"enter number";
			//cin>>n;
		//return n;	
		}
		T getnum()
		{
			cout<<"number is="<<mynumber<<endl;
		}
};
int main()
{
	
	student<int>s1;
	s1.student1(2);
	s1.getnum();
	student<float>s2;
	s2.student1(2.5);
	s2.getnum();
getch();
}
