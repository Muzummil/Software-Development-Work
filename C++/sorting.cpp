#include <iostream>
#include <conio.h>
using namespace std;
const int n=5;
class sort{
	int ar[n];
	public:
		void getar()
		{
			for(int i=1;i<=n;i++)
			{
			cout<<"enter num"<<i;
			cin>>ar[i];
		}
		}
		void show()
		{
			for(int i=1;i<=n;i++)
			{
				cout<<ar[i]<<endl;
			}
		}
		void sr()
		{
			for(int i=1;i<=n-1;i++)
			{
				for(int j=1;j<=n;j++)
				{
					if(ar[j]>ar[j+1])
					{
						int m;
						m=ar[j];
						ar[j]=ar[j+1];
						ar[j+1]=m;
					}
				}
				cout<<ar[i];
			}
		}
};
int main()
{
	sort d;
	d.getar();
	d.sr();
	d.show();
getch();
}

