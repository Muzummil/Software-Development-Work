#include <iostream>
#include<conio.h>
#include <math.h>
using namespace std;
int main ()
{                     // for main
                                                               int opert=0;       // flag for operator
                                                               char operat[5]={'+','-','*','/'};
                                                               char instruction=0;
                                                               char  operate=0;
                                                               const int size=15; //input array size
                                                               double digit[size];  //array for input
                                                               double  net=0;
                                                               char main=0;
                                                               char tutor=0;
                                                               char calculator=0;
                                                               double a=0;
                                                               char choice=0;
                                                               float angle=0;
                                                               char back=0;
   do 
   {                  //for do while
      cout<<"welcome to MANGO calculator"<<endl; 
      cout<<"To read instructions press 'i'"<<endl;
      cout<<"To start press 's'"<<endl;
         cin>> instruction;    
   if(instruction=='i')
 {                      // for if instructions == i
      cout<<"to go main page press 'm'"<<endl;
       cin>> main;
      }
      }
         while(instruction=='i'); 
    if(instruction=='s')
  {                   // for if instructions== s
      cout<<"to on tutar press 't'"<<endl; 
      cout<<"to off tutor press 'o'"<<endl; 
              cin>> tutor; 
	 cout<<"for typical calculations press 't'"<<endl;
     cout<<"for scientific calculator press 's'"<<endl;
            cin>> calculator;		  	
  }
    if( calculator=='t')
    {              //for if calculator== t
    if(tutor=='t')
    {             //for if tutor == t
    	 cout<<"enter the digit 1"<<endl;
        cin>>digit[0];
        a=digit[0];
    
    }
    if(tutor=='o')
	{            // for if tutor== o
		 cin>>digit[0];
        a=digit[0];
    
	}       
     for(int i=0;i<size;i++)
     {   //for 'for'
     if(tutor=='t')
     {    //for if tutor== t
     do
     {
          int a=0;
          if(a==0)
          {
     	 cout<<"enter the operator"<<endl;
             cin>> operate;
             }
             if(a!=0)
             {
                cout<<"enter the valid operator"<<endl;
             cin>> operate;
             }
              
       for(int i=0;i<5;i++)
    {
            if(operat[i]==operate)
            {
               a++;
               opert=2;
               break;
               }
               }
                     }
                     while(opert==0);                       

             cout<<"enter the digit"<<i+2<<endl;
             cin>>digit[i+1];
             a=digit[i+1];
     }
     if(tutor=='o')
     {   //ifor if tutor== o
     	cin>> operate;
     	cin>>digit[i+1];
        a=digit[i+1];
     }
            
      switch(operate)
      {    //for switch(operate)
       case '+':
                
             net=digit[0]+digit[i+1];
             digit[0]=net;
             cout<<"addition is ="<<net<<endl;
             
            
       break;
       case '-':
            net=digit[0]-digit[i+1];
            digit[0]=net;
            cout<<"subtraction is ="<<net<<endl;
            break;
             case '*':
            net=digit[0]*digit[i+1];
            digit[0]=net;
            cout<<"multiplication is ="<<net<<endl;
            break;
             case '/':
            net=digit[0]/digit[i+1];
            digit[0]=net;
            cout<<"division is ="<<net<<endl;
            break;
         default:
                  cout<<"enter the valid input or use scintific calculator"<<endl;
         break;   
      } 
			 if(a==0)
        {         //for if a==0
         i=size; 
		     break;   
         } 
            
	}
             
       
     
   }  
       if(calculator=='s')
    {          //for if(calculator=='s')  
    do
    {
        cout<<" to find angle press 'a'"<<endl;
        cout<<"for exponent press 'e'"<<endl;
        cout<<"for sequare press 's'"<<endl;
        cout<<"for under root press 'u'"<<endl;
                cin>>choice;
        if(choice=='a')
		{      // for if choice == a
		cout<<"enter the value of angle"<<endl;
             cin>> angle;
        cout<<"sin"<<angle<<"="<<sin(angle);
        cout<<"\ncos"<<angle<<"="<<cos(angle);
        cout<<"\ntan"<<angle<<"="<<tan(angle);	
		}       
	if(choice=='e')
		{     //for if choice == e
		cout<<"enter the value"<<endl;
	int value=0;
	       cin>> value;
int net;
		   net=value;
	    cout<<"enter the value of exponenet"<<endl;
int exp;
	       cin>> exp;
	for(int i=1; i<exp; i++)
	{       // for 'for'
	
		net=value*net;	
	}
		cout<<"your exponent is ="<<net<<endl;
		} 
	if(choice=='s')
	   {    // for if choice == s
	   	cout<<"enter the value"<<endl;
float value=0;
	        cin>> value;
	cout<<"sequare of"<<"("<<value<<")is ="<<value*value<<endl;
	   }
	if(choice=='u')
	   {   //for if choice == u
	    cout<<"enter the value"<<endl;
float value=0;
	         cin>> value;
	    cout<<"under root of"<<"("<<value<<") is ="<<sqrt(value)<<endl;
	   	
	   } 
	  	
		cout<<"to go back press 'b'"<<endl;
		
		cin>> back; 
        
    }   
	 while(back=='b') ;     
         
   }
         
         
         
  
 }
