using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ClassTry
{
    interface IFirst
    {
        void MyFirst();
    }
    public class FirstOne
    {
        public void MyFirst()
        {
            Console.WriteLine("First class function one");
        }
    }
    interface ISecond
    {
        void MySecond();
    }
    public class SecondOne
    {
        public void MySecond()
        {
            Console.WriteLine("Second class function one");
        }
    }
    //interface IThird
    //{
    //    void MyThird();
    //}
    public class ThirdOne : IFirst,ISecond
    {
        //public void MyThird()
        //{
        //    Console.WriteLine("Third class function one");
        //}
        FirstOne f1 = new FirstOne();
        SecondOne f2 = new SecondOne();
        public void MyFirst()
        {
            f1.MyFirst();
        }
        public void MySecond()
        {
            f2.MySecond();
        }

    }
    class Program
    {
        static void Main(string[] args)
        {
            ThirdOne to = new ThirdOne();
            to.MyFirst();
            to.MySecond();
            Console.ReadKey();
            //to.MyThird();
        }
    }
}
