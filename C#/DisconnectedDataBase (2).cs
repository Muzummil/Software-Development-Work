using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;

namespace DisconnectedDatabaseWpf
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            SqlConnection conn = null;
            conn = new SqlConnection("Server=MUZUMMILGUJJAR;Initial Catalog=UAAR;Integrated Security=SSPI;");
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM MyTable", conn);
                string st = conn.State.ToString();
                Debug.WriteLine(st);
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable("MyTable");
                sda.Fill(dt);
                //dgUsers.ItemsSource = dt.DefaultView;
                dgUsers1.ItemsSource = dt.DefaultView;
            }
            
        }
        

        
        
        //conn.Open();
    }
}
