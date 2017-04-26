using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
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

namespace YahooWeather
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            AddCities();
        }

        public void AddCities()
        {
            cbCities.Items.Add("Lahore,PK");
            cbCities.Items.Add("Gujranwala,PK");
            cbCities.Items.Add("Wazirabad,PK");
            cbCities.Items.Add("Gujrat,PK");
            cbCities.Items.Add("Kharian,PK");
        }

        private void cbCities_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            string selectedCity = cbCities.SelectedItem.ToString();
            if(selectedCity != "")
            {
                selectedCity = selectedCity.ToLower().Replace(",", "%2C");
                string xmlURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22"+ selectedCity.ToString() + "%22)&format=xml&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
                XmlReader reader = XmlReader.Create(xmlURL);
                //bool isTitleDone = false;
                int forecastCounter = 0;
                while (reader.Read())
                {
                    if (reader.NodeType == XmlNodeType.Element)
                    {
                        //if(reader.Name == "title" && !isTitleDone)
                        if (reader.Name == "title")
                        {
                            //isTitleDone = true;
                            reader.Read();
                            lblTitle.Content = reader.Value;
                        }

                        if (reader.Name == "yweather:condition")
                        {
                            lblTemprature.Content = reader.GetAttribute("temp");
                            lblDegree.Content = "O";
                            lblText.Content = reader.GetAttribute("text");
                        }

                        if (reader.Name == "yweather:forecast")
                        {
                            forecastCounter++;
                            if(forecastCounter > 1)
                            {
                                switch (forecastCounter)
                                {
                                    case 2:
                                        lblDay1.Content = reader.GetAttribute("date") + " - " + reader.GetAttribute("day") + "  " + reader.GetAttribute("high") + "\xB0 " + reader.GetAttribute("low") + "\xB0  " + reader.GetAttribute("text");
                                        break;
                                    case 3:
                                        lblDay2.Content = reader.GetAttribute("date") + " - " + reader.GetAttribute("day") + "  " + reader.GetAttribute("high") + "\xB0 " + reader.GetAttribute("low") + "\xB0  " + reader.GetAttribute("text");
                                        break;
                                    case 4:
                                        lblDay3.Content = reader.GetAttribute("date") + " - " + reader.GetAttribute("day") + "  " + reader.GetAttribute("high") + "\xB0 " + reader.GetAttribute("low") + "\xB0  " + reader.GetAttribute("text");
                                        break;
                                    case 5:
                                        lblDay4.Content = reader.GetAttribute("date") + " - " + reader.GetAttribute("day") + "  " + reader.GetAttribute("high") + "\xB0 " + reader.GetAttribute("low") + "\xB0  " + reader.GetAttribute("text");
                                        break;
                                    case 6:
                                        lblDay5.Content = reader.GetAttribute("date") + " - " + reader.GetAttribute("day") + "  " + reader.GetAttribute("high") + "\xB0 " + reader.GetAttribute("low") + "\xB0  " + reader.GetAttribute("text");
                                        break;
                                    case 7:
                                        lblDay6.Content = reader.GetAttribute("date") + " - " + reader.GetAttribute("day") + "  " + reader.GetAttribute("high") + "\xB0 " + reader.GetAttribute("low") + "\xB0  " + reader.GetAttribute("text");
                                        break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
