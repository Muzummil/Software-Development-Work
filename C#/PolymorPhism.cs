using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PolymorphismTry
{
    class FirstClass
    {
        public virtual void FirstOne()
        {
            Console.WriteLine("First class first function");
        }
        public virtual void Talk()
        {
            Console.WriteLine("First Talk");
        }
    }
    class SecondClass:FirstClass
    {
        public override void FirstOne()
        {
            Console.WriteLine("Second class first function");
        }
        public override void Talk()
        {
            Console.WriteLine("Second Talk");
        }

    }
    class Program
    {
        static void Main(string[] args)
        {
            FirstClass fc = new SecondClass();
            fc.FirstOne();
            fc.FirstOne();
            fc.Talk();


            

            Console.ReadKey();
        }
    }
}
