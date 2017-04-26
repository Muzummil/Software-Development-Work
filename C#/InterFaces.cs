using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Interfaces
{
    interface IFirst
    {
        void func1();
    }
    class FirstOne:IFirst
    {
        public void func1()
        {
            Console.WriteLine("My first func1");
        }
    }
    interface ISecond
    {
        void func2();
    }
    class SecondOne:ISecond
    {
        public void func2()
        {
            Console.WriteLine("My second func2");
        }
        
    }

    
     class ThirdOne:IFirst,ISecond
    {
         FirstOne f1 = new FirstOne();
         SecondOne f2 = new SecondOne();
         
         
         public void func1()
         {
             f1.func1();
             //Console.WriteLine("My second func2");
         }
         public void func2()
         {
             f2.func2();
             // Console.WriteLine("My second func2");
         }
        
        
        public void func3()
        {
            Console.WriteLine("My third func3");
        }
    }
    class Program
    {
        static void Main(string[] args)
        {
            ThirdOne ne = new ThirdOne();
            ne.func1();
            ne.func2();
            ne.func3();
            Console.ReadKey();
        }
    }
}
