using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Xml;
namespace Tries
    
{
    class Program
    {
        static void Main(string[] args)
        {
            string add = "C:\\Users\\Muzummil Gujjar\\Documents\\Visual Studio 2013\\Projects\\abc.xml";
            XmlReader rr = XmlReader.Create(add);
            if(rr!=null)
            {
                while(rr.Read())
                {
                    switch (rr.NodeType)
                    {
                        case XmlNodeType.Element:
                            Console.WriteLine("<" + rr.Name + ">");
                            //if(XmlNodeType.Attribute.)
                            break;
                        case XmlNodeType.Text:
                            Console.WriteLine("\n"+rr.Value+"\n");
                            break;
                        case XmlNodeType.EndElement:
                            Console.WriteLine("</" + rr.Name + ">");
                            break;
                    }
                }
            }
            else
            {
                Console.WriteLine("error in reading file");
            }
            Console.ReadKey();
        }
        
    }
}
