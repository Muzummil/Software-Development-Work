#include <iostream>
#include <conio.h>
using namespace std;
float dollar=50;  //dollar rate in Pakistani rupees 
float euro=100;  //euro rate in Pakistani rupees

int main()
{
    cout<<"Umair Afzal"<<endl;
    cout<<"Reg no 14-arid-1424"<<endl;
    cout<<endl;
    int rep;                 //take repeat for use in while condition 
    do                   //use do while loop for repeat convertor
    {
    cout<<"first enter the value and select option like 200k"<<endl;
    cout<<"for doller to rupees use k"<<endl;
    cout<<"for rupees to dollar use a"<<endl;
    cout<<"for Euro   to rupees use m"<<endl;
    cout<<"for rupees to euro   use r"<<endl;
    cout<<"for euro   to dollar use s"<<endl;
    cout<<"for dollar to euro   use p"<<endl;
    cout<<"please enter your amount and press enter key "<<endl<<"="; //tell your to write
    float input;            //take float for input amount
    cin>>input;               //get amount from user and save in 'input'
    cout<<"please enter conversion name (as shown above) and press enter key "<<endl;
    char z;             //z=use for save converteor oprater charactar
    cin>>z;               //save converter charactar in k
    float output;               //take float output amount
    char l;                //take char l for save repeat condition charactor i.e y,n                            
    if (z=='k'||z=='K')   //for rupees to dollor 
    {
    output=dollar*input;              
     }
     if (z=='a'||z=='A')          //exchange dollar to rupees
      {
         output=input/dollar;      
       }
      if (z=='m'||z=='M')         //exchange rupees to euro
      {
       output=euro*input;          
        }
        if (z=='r'||z=='R')        //exchange euro to rupees
         {
          output=input/euro;       
          }
           if (z=='s'||z=='S')       //exchange euro to dollor
            {
              output=(euro*input)/dollar;
               }
              if (z=='p'||z=='P')       //exchange dollor to euro
                {
                 output=(dollar*input)/euro;
                  }                
        cout<<"your conversion amount is "<<output<<endl;
        cout<<"if you want to reapeat your amount press y and if you want end press n"<<endl;
        cin>>l;              //save charactor for repeat i.e y or N
     if (l=='y'||l=='Y')     //y=yes repeat program
     {
        rep=2;                //take repeat=4 for continue program
        rep=rep++;
        }
        if (l=='n'||l=='N')     //n= stop program
        {     
          rep=1;                 //repeat= 2 for break program
          cout<<"Thank for using my software..........";
          }
}      
      while (rep>1);            //condition for repeat program        
      getch();                
                                                       
}
