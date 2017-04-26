using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace ConsoleDatabase
{
    class Program
    {
        static void Main(string[] args)
        {
            SqlConnection conn = null;
            using (conn = new SqlConnection("Server=MUZUMMILGUJJAR;Initial Catalog=UMS;Integrated Security=SSPI;"))
            {

            //Disconnected mode
            conn.Open();
            SqlCommand cmd = new SqlCommand("SELECT    * FROM Users", conn);

            //SqlDataAdapter sda = new SqlDataAdapter(cmd);
            //DataTable dt = new DataTable("Users");
            //sda.Fill(dt);
            
            ////dgUsers is the object of data grid view in wpf tool.
            ////dgUsers.ItemSource = dt.DefaultView;



            SqlDataReader sdr = cmd.ExecuteReader();
            while (sdr.Read())
            {
                Console.WriteLine(/*"{0}. First Name {1} & Last Name {2}",*/ "  {0} F.Name{1} and LastName {2} ", sdr[0], sdr[1],sdr[2]);
                //Console.WriteLine(sdr[1][2]);
            }
            //conn.Open();
            //Execute Non Query  //Execute Scaler????
            //SqlCommand cmd2 = new SqlCommand("INSERT into Users (FirstName,LastName) values('Ali','Raza')", conn);
            //cmd2.ExecuteNonQuery();
            //Console.WriteLine("No of rows inserted are " + noRows.ToString());
            string ssr = sdr.ToString();
            Console.WriteLine("The ssr is =" + ssr);



            string sr = conn.State.ToString();
            if (sr != "Open")
            {
                Console.WriteLine("Connenction is not open");
            }
              
        
        //if (sr=="Open")
            //{
            //    Console.WriteLine("Connenction is open");
            //}


                        /***Stored Procedure***/
        //cmd.CommandType = CommandType.StoredProcedure;
        //SqlCommand cmd = new SqlCommand("SELECT    * FROM Users/*instead of writing this query add a specific name used in stored procedure in database*/, conn);
            
        
                         /***Execute Non Query***/
        //SqlCommand cmd2 = new SqlCommand("DELETE from Users WHERE FirstName='Ali'", conn);
                //SqlCommand cmd2 = new SqlCommand("UPDATE Users SET LastName='Iqbal' WHERE FirstName='Muzummil'",conn);
                //int n = cmd2.ExecuteNonQuery();
        
        
        }
        Console.ReadKey();


        }
    }
}
