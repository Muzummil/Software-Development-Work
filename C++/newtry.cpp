#include <iostream>
#include <conio.h>
using namespace std;
int main()
{
	short j=0;
char c;
	double total,totale,totalps,totalds,totalitc,totalpf,totalc;
    double grade,gradee,gradec,gradeitc,gradeps,gradepf,gradeds;
double mide=0,sectionale=0,finale=0,totalmarkse=0;
double midc=0,sectionalc=0,finalc=0,totalmarksc=0;
double midps=0,sectionalps=0,finalps=0,totalmarksps=0;
double midpf=0,sectionalpf=0,finalpf=0,totalmarkspf=0;
double midds=0,sectionalds=0,finalds=0,totalmarksds=0;
double miditc=0,sectionalitc=0,finalitc=0,totalmarksitc=0;	
do
{
	cout<<"of english";
	{
	cout<<"enter your marks obtained in midterm of English";
	cin>>mide;
	cout<<"enter your marks obtained in setional of English";
	cin>>sectionale;
	cout<<"enter your marks obtained in final  English";
	cin>>finale;
	cout<<"enter total marks of English";
	cin>>totalmarkse;
	totale=mide+sectionale+finale;
	gradee=totale/totalmarkse*100;
	j=1;
	}
	cout<<"of calculas";
	{

	cout<<"enter your marks obtained in midterm of Calculas";
	cin>>midc;
	cout<<"enter your marks obtained in setional of Calculas";
	cin>>sectionalc;
	cout<<"enter your marks obtained in final of Calculas";
	cin>>finalc;
	cout<<"enter total marks of Calculas";
	cin>>totalmarksc;
	totalc=midc+sectionalc+finalc;
	gradec=totalc/totalmarksc*100;
j=1;
}
  cout<<"of pakistan studies";
{
cout<<"enter your marks obtained in midterm of Pakistan Studies";
	cin>>midps;
	cout<<"enter your marks obtained in setional of Pakistan studies";
	cin>>sectionalps;
	cout<<"enter your marks obtained in final of Pakistan studies";
	cin>>finalps;
	cout<<"enter total marks of Pakistan studies";
	cin>>totalmarksps;
	totalps=midps+sectionalps+finalps;
	gradeps=totalps/totalmarksps*100;
j=1;
}
cout<<"of programming";
{
	cout<<"enter your marks obtained in midterm of Programming fundamentals";
	cin>>midpf;
	cout<<"enter your marks obtained in setional of Proramming fundamentals";
	cin>>sectionalpf;
	cout<<"enter your marks obtained in final of Programming fundamentals";
	cin>>finalpf;
	cout<<"enter total marks of Programming fundamentals";
	cin>>totalmarkspf;
	totalpf=midpf+sectionalpf+finalpf;
	gradepf=totalpf/totalmarkspf*100;
j=1;
}
cout<<"of ict";
{
	cout<<"enter your marks obtained in midterm of ITC";
	cin>>miditc;
	cout<<"enter your marks obtained in setional of ITC";
	cin>>sectionalitc;
	cout<<"enter your marks obtained in final of ITC";
	cin>>finalitc;
	cout<<"enter total marks of ITC";
	cin>>totalmarksitc;
	totalitc=miditc+sectionalitc+finalitc;
	gradeitc=totalitc/totalmarksitc*100;
j=1;
}
cout<<"of discrete";
{
	cout<<"enter your marks obtained in midterm of Discrete structeres";
	cin>>midds;
	cout<<"enter your marks obtained in setional of Discrete structeres";
	cin>>sectionalds;
	cout<<"enter your marks obtained in final of Discrete structeres";
	cin>>finalds;
	cout<<"enter total marks of Discrete structeres";
	cin>>totalmarksds;
	totalds=midds+sectionalds+finalds;
	gradeds=totalds/totalmarksds*100;
    j=1;
}
total=totale+totalps+totalc+totalpf+totalitc+totalds;
grade=gradee+gradeps+gradec+gradepf+gradeitc+gradeds;
	if(grade>80)
	{
		cout<<"wao! your cgpa is 4";
	}
if(grade<80||grade>75)
{
cout<<"your cgpa is above 3.5";	
	}	
if(grade<75||grade>70)
{
	cout<<"your cgpa is below 3.5 and above 3";
	}	
if(grade<70||grade>64)
{
	cout<<"your cgpa is 3";
	}	
	if(grade<64||grade>50)
	{
		cout<<"your cgpa is above 2 and below 3";
	}
cout<<"press y to start again or press x to close";	
if(c=='x')
{
	cout<<"thank for using bye bye";
	j=20;
}
if(c=='y')
{
	j++;
}
}
while(j<10);
getch();
}
