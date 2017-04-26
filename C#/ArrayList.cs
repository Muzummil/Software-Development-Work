using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;

namespace ArrayListTry
{
   public class FirstOne
    {
        public int num1=12; string MyName="ALI";
        private int p1;
        private string p2;
        
    
       // FirstOne(int n1,string s1)
       // {
       //     num1 = n1;
       //     MyName = s1;
       //}
        public FirstOne()
        {
            // TODO: Complete member initialization
        }
        public FirstOne(int p1, string p2)
        {
            // TODO: Complete member initialization
            this.p1 = p1;
            this.p2 = p2;
        }

        
    public void BasicFunction()
    {
        Console.WriteLine("\n" + num1 + "\n" + MyName);
    }
    
    }
    class SecondOne : FirstOne
    {
        //SecondOne(int n1, string s1)
        //{

        //}
        public void SecondClassFunction()
        {
            // Console.WriteLine("\n" + num1 + "\n" + MyName);
        }
    }
    class Program
    {
        static void Main(string[] args)
        {
            FirstOne fo = new FirstOne();
            fo.BasicFunction();
            ArrayList arr = new ArrayList();
            //FirstOne s1 = (FirstOne)arr[1];
            arr.Add(new FirstOne(18, "Raza"));

            int n = 0,n1=0;
            int[] arr1 = new int[4];
            //arr1[n1] = n1++;
            //Console.WriteLine(n1);
            
           // Console.WriteLine(n);
            arr1[n++] = ++n;
            Console.WriteLine(n + "and");//+arr1[n]);
           // n = 0;
            arr1[n++] = n;
            Console.WriteLine(n + "and"); //+ arr1[n]);

            Console.WriteLine("zero index"+arr1[0]);
            Console.WriteLine("1st index" + arr1[1]);
            Console.WriteLine("2nd index" + arr1[2]);
            Console.WriteLine(arr1[3]);

            Console.ReadKey();
        }
    }
}
