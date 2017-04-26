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
using System.Diagnostics;
using System.Data;
using System.Data.SqlClient;

namespace DatabaseLoginWpf
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Loginbtn_Click(object sender, RoutedEventArgs e)
        {
            bool usernameerror = false;
            Usernamelbl.Content = "";
            if(UsernameBox.Text.Trim().Length<1)
            {
                usernameerror = true;
                Usernamelbl.Content = "Username could not be empty";
                
            }
            if (PasswordBox.Password.Trim().Length < 1)
            {
                usernameerror = true;
                Passwordlbl.Content = "Password could not be empty";
                
            }
            else if (!usernameerror)
            {
                string username = UsernameBox.Text.Trim();
                string password1 = PasswordBox.Password.Trim();
                int password;
                bool condition = int.TryParse(password1, out password);
                if (condition)
                {
                    password = int.Parse(password1);
                }
                else
                {
                    Passwordlbl.Content += "Password must be an integer value";
                }
                SqlConnection conn = new SqlConnection("Server=MUZUMMILGUJJAR;Initial Catalog=UAAR;Integrated Security=SSPI");
                conn.Open();
                string cmd="SELECT * FROM MyTable WHERE Username='"+username+"'AND Password='"+password+"'";
                SqlCommand sc=new SqlCommand(cmd,conn);
                Debug.WriteLine(conn.State);
                SqlDataReader rdr = sc.ExecuteReader();
                while (rdr.Read())
                {
                    MessageBox.Show("welcome");
                }
                if(rdr.HasRows)
                {
                    Welcome we = new Welcome();
                    this.Hide();
                    we.Show();
                }
                else
                {
                    MessageBox.Show("Username or Password invalid");
                }
            }
        }

        private void clear_Click(object sender, RoutedEventArgs e)
        {
            UsernameBox.Clear();
            PasswordBox.Clear();
        }

    }
}
