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

namespace DatabaseForm
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
        int count = 0;
        public void textBlock2()
        {

           // char[] alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".ToCharArray();
            //txtbox2.Text += alpha[3];
            string[] arr={"@","d","1","0","#","1","!","%","z","w","+","%","*","P","?","1","{","0","0","+"};

            string ssttr = txtbox1.Text;

            //txtbox2.Text = ssttr;
            int num;
            bool numCon = int.TryParse(ssttr,out num);
            if (numCon)
            { 
            txtbox2.Text += "value in int"+num;
            }

//                string s = "abcdef";



//                string value="abcd";

//value.ToCharArray();

//textbox1.Text=Convert.toString(value[0]);


               // var result = "black door,white door,red door".Split(',');
            else
            {
                txtbox2.Text = txtbox1.Text;
            }
            string[] a = new string[ssttr.Length];
            for (int i = 0; i < ssttr.Length; i++)
            {
                a[i] = ssttr[i].ToString();
            }
            int cc = 0;
            int[] b = new int[ssttr.Length];
            for (int i = 0; i < ssttr.Length; i++)
            {
                bool cv = int.TryParse(a[i], out b[i]);
                if (cv)
                {
                    b[i] = int.Parse(a[i]);
                    txtbox2.Text += "parsing of integer" + b[i];
                    cc++;
                }
                else
                {
                    i++;
                }
                
            }
            int l = ssttr.Length;
            int nl=0;

            string[] a2 = new string[l];
            a2[0] = "sd";
            int df=0;
            for (int i = 0; i < cc; i++)
            {
                 df +=b[i];
                
            }
            string ssg="";
            string sdr="";
            for(int i=0;i<cc;i++){
            sdr=string.Join(ssg,b[i]);
            }
            txtbox2.Text += "in a single" + sdr;


            //do
            //{
                
            //    nl++;
            //}
            //while (nl != l)
            //{
               // txtbox2.Text += a[l - l] + a[l - (l - 1)] + a[l - (l - 2)] + a[l - (l - 3)];
               //txtbox2.Text +=  a[nl];
               //txtbox2.Text += a[nl];
               //nl++;
            //}
            //txtbox2.Text +="at 2nd "+ a[2];
        }
        
        
        private void Button_Click(object sender, RoutedEventArgs e)
        {
            textBlock2();
            if (count == 0)
            {
                MessageBox.Show("first click");
            }
            if (count == 1)
            {
                MessageBox.Show("second click");
            }
            if (count == 2)
            {
                MessageBox.Show("third click");
            }
            if (count == 3)
            {
                MessageBox.Show("fourth click");
            }
            count++;

        }
        
    }
}
