			// Saqib Ali 
			// Roll no = 1452
			// BS-IT
#include <iostream>
#include <conio.h>
  
 using namespace std;  
 int main()  
 {  
      float amount=0;  
      char choice1, choice2, choice3='y';  
      while (choice3=='Y' || choice3=='y')  
      {  
           cout<<"Select the currencies that you want to exchange\n";  
           cout<<" - Enter R for Pakistani Rupees\n";  
           cout<<" - Enter E for Euro\n";  
           cout<<" - Enter D for Dollar\n"<<endl;  
           cout<<"Please select the currency that you want to convert"<<endl;  
           cin>>choice1;  
           cout<<"Please enter the currency that you want to convert into"<<endl;  
           cin>>choice2;  
           cout<<"Enter Amount: ";  
           cin>>amount;  
           if ( (choice1=='R' || choice1=='r') && (choice2=='E' ||choice2=='e'))  
           {  
                //division of rupees by 50 to convert into euros  
                cout<<amount <<" Rupees = "<<amount/50<<" Euros"<<endl;    
           }  
           else if ( (choice1=='R'|| choice1=='r') && (choice2=='D' || choice2=='d'))  
           {  
                //Division of rupees by 100 to convert into dollars  
                cout<<amount <<" Rupees = "<<amount/100<<" Dollars"<<endl;   
           }  
           else if ( (choice1=='E'||choice2=='e') && (choice2=='R' || choice1=='r'))  
           {  
                //multiplication of Euros by 50 to convert into rupees  
                cout<<amount <<" Euros = "<<amount*50<<" Rupees"<<endl;   
           }  
           else if ( (choice1=='E'||choice2=='e') && (choice2=='D'|| choice2=='d'))  
           {  
                //multiplication of Euros by 2 to convert into dollars  
                cout<<amount <<" Euros = "<<amount*2<<" Dollars"<<endl;   
           }  
           else if ( (choice1=='D'|| choice2=='d') && (choice2=='R'|| choice1=='r'))  
           {  
                //multiplication of dollars by 100 to convert into rupees  
                cout<<amount <<" Dollars = "<<amount*100<<" Rupees"<<endl;   
           }  
           else if ( (choice1=='D'|| choice2=='d') && ( choice2=='E'||choice2=='e'))  
           {  
                //division of dollars by 2 to convert into euros  
                cout<<amount <<" Dollars = "<<amount/2<<" Euros"<<endl;   
           }
           cout<<"Do you want to repeat the conversion? ( Y/N ) :";  
           cin>>choice3;  
           cout<<"Goodbye :) "<<endl;
      }  
      
      getch();  
 }
