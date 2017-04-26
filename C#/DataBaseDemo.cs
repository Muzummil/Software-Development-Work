using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

namespace DBDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            //1. create connection string
            string connString = "Server=MUZUMMILGUJJAR;Database=SMS;Integrated Security=true";
            
            //2. passing connection string to the sql connection object
            SqlConnection conn = new SqlConnection(connString);
            if(conn.State != ConnectionState.Open) //checking if already opened
            {
                conn.Open();
            }

            //3. string based query
            string query = "SELECT * FROM Users";

            //4. creating sql command
            SqlCommand cmd = new SqlCommand(query, conn);

            //5. reading data from reader
            SqlDataReader rdr = cmd.ExecuteReader();

            //6. itearating data
            while(rdr.Read())
            {
                //Console.WriteLine("{0}: {1} {2}, {3}", rdr[0], rdr[1], rdr[2], rdr[3]);
                Console.WriteLine(rdr[0] +""+ rdr[1] +""+ rdr[2] + rdr[3]);
            }

            //7. closing the connection
            if (conn.State != ConnectionState.Closed) //checking if already closed
            {
                conn.Close();
            }

            Console.ReadKey();
        }
    }
}
