#include <iostream>
#include <conio.h>
using namespace std;
const int n=6;
class bs{
	int ar[n];
	public:
		void getar()
		{
			for(int i=1;i<=6;i++)
			{
			cout<<"enter array element"<<i;
			cin>>ar[i];
		}
		}
		void search()
		{
			int s;
			cout<<"enter number to search";
			cin>>s;
			for(int k=1;k<=n/2;k++)
			{
				if(s==ar[k])
				{
					cout<<"number found at index"<<k;
				}
			}
			int k2=n/2;
			for(k2=n/2;k2<=n;k2++)
			{
				if(s==ar[k2])
				{
					cout<<"number found at index"<<k2;
				}
			}
		}
};
int main()
{
	bs d;
	d.getar();
	d.search();
getch();
}

