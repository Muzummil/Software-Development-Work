using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArrayTry
{
    class Program
    {
        static void Main(string[] args)
        {
            int n = 4;
            string[] arr1 = {"Apple", "Mango", "Orange"};
            
            
            //for (int k=0; k <n; k++)
            //{
            //    Console.WriteLine("enter value" + (k + 1) + "of array");
            //    arr1[k] = Console.ReadLine();
            //}

            foreach (string ele in arr1)
            {
                Console.WriteLine(ele);
                //arr1[l] = Console.ReadLine();
            }

            //foreach (int l in arr1[n])
            //{
            //    Console.WriteLine("value" + (l + 1) + "of array is =" + arr1[l]);
            //}
            
           // Updating 
             //   a 'foreach statement' statement around an active statement will prevent the debug session from continuing while Edit and Continue is enabled.
            //for (int k = 0; k < n; k++)
            //{
            //    Console.WriteLine("value" + (k + 1) + "of array is ="+arr1[k]);
            //}

            Console.ReadKey();
        }
    }
}
