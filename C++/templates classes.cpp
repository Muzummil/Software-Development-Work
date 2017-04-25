#include <iostream>
#include <conio.h>
using namespace std;
template <class type>
class student{
	type mynumber;
	public:
		type stu()
		{
			type a;
			cout<<"enter mynumber";
			cin>>a;
			mynumber=a;
			return a;//cout<<mynumber<<endl;
		}
		
		type stu2()
		{
			type b;
			cout<<"enter my float number";
			cin>>b;
			mynumber=b;
			return b;//cout<<mynumber<<endl;
		}
		
		type display()
		{
			cout<<"number is"<<mynumber;
			return mynumber;//cout<<"your number"<<mynumber;
		}
		type function()
		{
			string s;
			cout<<"enter string";
			cin>>s;
			cout<<"your entered string"<<s<<endl;
			return s;
		}
};
int main()
{
    //template<class type>;
	//student<type>s1;
	cout<<"for integers";
    student<int>s1;
	s1.stu();
	
	student<float>s3;
	s3.stu2();
	
	cout<<"for string";
    student<string>s2;
	s2.stu();
	s1.display();
cout<<"string is="<<s2.display();
//s1.function();
//s2.function();
getch();
}

