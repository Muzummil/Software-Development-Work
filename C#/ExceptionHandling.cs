using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace ExceptionHandling
{
    class Program
    {
        static void Main(string[] args)
        {
            StreamReader str=null;
            try
            {
                 str = new StreamReader("E:\\University\\Smester 5\\Visual Programing\\1resources.txt");
                Console.WriteLine(str.ReadToEnd());
                //Console.WriteLine(str);
                //if (str == null)
                //{
                //    throw new FileNotFoundException();
                //}
            }
            catch (FileNotFoundException ex)
            {
                Console.WriteLine("catch block"+ex.Message);
            }
            finally
            {
                if(str!=null){

                str.Close();
                }
                Console.WriteLine("finally block");
                
            }
            Console.ReadKey();
        }
    }
}
