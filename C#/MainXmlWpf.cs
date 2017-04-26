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
using System.Xml;
using System.Diagnostics;

namespace XmlWpf
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
        public void try1()
        {
           
        }
        public void XmlReader2()
        {
            string address = "E:\\abc.xml";
            XmlReader rdr = XmlReader.Create(address);
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    switch (rdr.NodeType)
                    {
                        //case XmlNodeType.Element:
                          //  Debug.WriteLine(rdr.Name);
                            
                            //txtbox.Text += rdr.Name.ToString() + Environment.NewLine;
                            //break;
                        case XmlNodeType.Text:
                            Debug.WriteLine(rdr.Value);
                            txtbox.Text += Environment.NewLine + rdr.Value.ToString() + Environment.NewLine;
                            break;
                        
                    }
                }
            }
        }
        public void ListView()
        {
            TreeViewItem ts1 = new TreeViewItem();
            ts1.Header = "14-arid-1418";
            ts1.Items.Add("Zaheer");
            ts1.Items.Add("Mughal");
            ts1.Items.Add("28");

            TreeViewItem tsubject1 = new TreeViewItem();
            tsubject1.Header = "14-arid-1418";
            tsubject1.Items.Add("Atif");
            tsubject1.Items.Add("Mughal");
            tsubject1.Items.Add("28");
            
            ts1.Items.Add(tsubject1);
            treePart.Items.Add(ts1);
        }
        

        private void btn1_Click(object sender, RoutedEventArgs e)
        {
            ListView();
        }

        private void xmlbtn_Click(object sender, RoutedEventArgs e)
        {
            XmlReader2();
            try1();

        }
    }
}
