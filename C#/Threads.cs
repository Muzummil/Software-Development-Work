using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Thread1
{
    class Program
    {
        static void Main(string[] args)
        {
            Thread th1 = new Thread(function1);
            Thread th2 = new Thread(function2);
            th1.Start();
            th2.Start();
            Console.ReadLine();
        }
        public static void function1()
        {
            for (int i = 0; i < 10; i++)
            {
                Console.WriteLine("hello in function 1");
                Thread.Sleep(1000);
            }
        }
        public static void function2()
        {
            for (int i = 0; i < 5; i++)
            {
                Console.WriteLine("hello in function 2");
                Thread.Sleep(4000);
            }
        }
    }
}
