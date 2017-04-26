using System;
using System.Collections.Generic;
using System.Diagnostics;
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

namespace Project1Try
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
        int selectedFn = 100;
        int counter = 0;
        int counter2 = 0;

        List<string> two, two2, two3 = null, two34 = null;

        static int sizeofstring = 0; int sd, sd2, sd3 = 0, sd4 = 0;
        char[] dp;
        int count = 0, count2 = 0, newint = 0;
        string mainString;
        List<int> CopyOfIntegers = new List<int>(4);
        List<string> copyofString = new List<string>(10);
        List<string> d1 = new List<string>(2);
        string[] a; string ssr;

        int[] integerString; string[] second2, second22, second23 = null, second234 = null, second224 = null;

        string second3 = null, second32 = null, second33 = null, second334 = null;

        string[] decryptStringArr;

        string decryptString1, decryptString12, decryptString13 = null, decryptString134 = null;

        int check = 0;
        int check2 = 0;

        string comp = null;

        int az = 0, t1 = 0;

        public void encrypt()
        {
            mainString = txtbox1.Text.Trim();
            if (mainString.Length < 6)
            {
                box1lbl.Content = "Password length must be greater than six chracters";
                txtbox1.Clear();
                txtbox1.Focus();
            }

            else
            {
                box1lbl.Content = null;
                integerString = new int[mainString.Length];
                a = new string[mainString.Length];
                for (int i = 0; i < mainString.Length; i++)
                {
                    a[i] = mainString[i].ToString();
                }
                for (int i = 0; i < mainString.Length; i++)
                {
                    copyofString.Add(a[i]);
                }
                sizeofstring = copyofString.Count;
            }
        }
        string[] valuesofstring = new string[sizeofstring];
        public void Encryption1()
        {
            valuesofstring = copyofString.ToArray();
            for (int j = 0; j < sizeofstring; j++)
            {
                switch (valuesofstring[j])
                {
                    case "a":
                        valuesofstring[j] = "$####$#";
                        break;
                    case "b":
                        valuesofstring[j] = "$$#$#$#";
                        break;
                    case "c":
                        valuesofstring[j] = "#$$$##$";
                        break;
                    case "d":
                        valuesofstring[j] = "##$$$##";
                        break;
                    case "e":
                        valuesofstring[j] = "$#$#$##";
                        break;
                    case "f":
                        valuesofstring[j] = "$$$#$##";
                        break;
                    case "g":
                        valuesofstring[j] = "#$#$##$";
                        break;
                    case "h":
                        valuesofstring[j] = "#$##$#$";
                        break;
                    case "i":
                        valuesofstring[j] = "#$#####";
                        break;
                    case "j":
                        valuesofstring[j] = "##$#$$$";
                        break;
                    case "k":
                        valuesofstring[j] = "##$##$#";
                        break;
                    case "l":
                        valuesofstring[j] = "###$###";
                        break;
                    case "m":
                        valuesofstring[j] = "#$#$$$#";
                        break;
                    case "n":
                        valuesofstring[j] = "$###$#$";
                        break;
                    case "o":
                        valuesofstring[j] = "#$$#$#$";
                        break;
                    case "p":
                        valuesofstring[j] = "#####$#";
                        break;
                    case "q":
                        valuesofstring[j] = "$#$###$";
                        break;
                    case "r":
                        valuesofstring[j] = "$##$$$$";
                        break;
                    case "s":
                        valuesofstring[j] = "#$###$#";
                        break;
                    case "t":
                        valuesofstring[j] = "#$##$$#";
                        break;
                    case "u":
                        valuesofstring[j] = "$$#$###";
                        break;
                    case "v":
                        valuesofstring[j] = "#$#$$#$";
                        break;
                    case "w":
                        valuesofstring[j] = "##$#$$#";
                        break;
                    case "x":
                        valuesofstring[j] = "#$$###$";
                        break;
                    case "y":
                        valuesofstring[j] = "######$";
                        break;
                    case "z":
                        valuesofstring[j] = "#$$$$$#";
                        break;


                    case "A":
                        valuesofstring[j] = "$###$$#";
                        break;
                    case "B":
                        valuesofstring[j] = "#$#$$$$";
                        break;
                    case "C":
                        valuesofstring[j] = "$$#$##$";
                        break;
                    case "D":
                        valuesofstring[j] = "#$$##$#";
                        break;
                    case "E":
                        valuesofstring[j] = "#$$$#$$";
                        break;
                    case "F":
                        valuesofstring[j] = "$$#$#$$";
                        break;
                    case "G":
                        valuesofstring[j] = "###$#$#";
                        break;
                    case "H":
                        valuesofstring[j] = "$##$#$#";
                        break;
                    case "I":
                        valuesofstring[j] = "#$$#$$#";
                        break;
                    case "J":
                        valuesofstring[j] = "$$#$$#$";
                        break;
                    case "K":
                        valuesofstring[j] = "##$$#$#";
                        break;
                    case "L":
                        valuesofstring[j] = "##$#$#$";
                        break;
                    case "M":
                        valuesofstring[j] = "$##$##$";
                        break;
                    case "N":
                        valuesofstring[j] = "$##$$#$";
                        break;
                    case "O":
                        valuesofstring[j] = "#$$#$##";
                        break;
                    case "P":
                        valuesofstring[j] = "###$$$#";
                        break;
                    case "Q":
                        valuesofstring[j] = "$#$$#$#";
                        break;
                    case "R":
                        valuesofstring[j] = "$$###$#";
                        break;
                    case "S":
                        valuesofstring[j] = "####$$#";
                        break;
                    case "T":
                        valuesofstring[j] = "$#$##$#";
                        break;
                    case "U":
                        valuesofstring[j] = "#$$$$#$";
                        break;
                    case "V":
                        valuesofstring[j] = "#$##$$$";
                        break;
                    case "W":
                        valuesofstring[j] = "$#####$";
                        break;
                    case "X":
                        valuesofstring[j] = "$$###$$";
                        break;
                    case "Y":
                        valuesofstring[j] = "###$#$$";
                        break;
                    case "Z":
                        valuesofstring[j] = "$$$$$##";
                        break;

                    case "1":
                        valuesofstring[j] = "#$$$###";
                        break;
                    case "2":
                        valuesofstring[j] = "#$##$##";
                        break;
                    case "3":
                        valuesofstring[j] = "$$$#$#$";
                        break;
                    case "4":
                        valuesofstring[j] = "#$#$#$#";
                        break;
                    case "5":
                        valuesofstring[j] = "$#$$$##";
                        break;
                    case "6":
                        valuesofstring[j] = "$$$$$#$";
                        break;
                    case "7":
                        valuesofstring[j] = "$$$$##$";
                        break;
                    case "8":
                        valuesofstring[j] = "$#$#$$#";
                        break;
                    case "9":
                        valuesofstring[j] = "#$$$#$#";
                        break;
                    case "0":
                        valuesofstring[j] = "$####$$";
                        break;
                    case "!":
                        valuesofstring[j] = "$##$#$$";
                        break;
                    case "#":
                        valuesofstring[j] = "#$$####";
                        break;
                    case "@":
                        valuesofstring[j] = "$#$##$$";
                        break;
                    case "$":
                        valuesofstring[j] = "#####$$";
                        break;
                    case "&":
                        valuesofstring[j] = "$#$$##$";
                        break;
                    case "*":
                        valuesofstring[j] = "$######";
                        break;
                    case "^":
                        valuesofstring[j] = "##$##$$";
                        break;
                    case "-":
                        valuesofstring[j] = "$$$$#$$";
                        break;
                    case "_":
                        valuesofstring[j] = "$##$$##";
                        break;
                    case ")":
                        valuesofstring[j] = "$#$$$$$";
                        break;
                    case ";":
                        valuesofstring[j] = "$$##$$#";
                        break;
                    case ",":
                        valuesofstring[j] = "$$#####";
                        break;
                    case "|":
                        valuesofstring[j] = "$$$##$$";
                        break;
                    case "+":
                        valuesofstring[j] = "$#$$#$$";
                        break;
                    case "~":
                        valuesofstring[j] = "#$#$#$$";
                        break;
                    case "/":
                        valuesofstring[j] = "$#$#$$$";
                        break;
                    case "<":
                        valuesofstring[j] = "###$##$";
                        break;
                    case ">":
                        valuesofstring[j] = "$$##$#$";
                        break;
                    case "?":
                        valuesofstring[j] = "$###$$$";
                        break;
                    case "=":
                        valuesofstring[j] = "##$#$#$";
                        break;

                }
            }

            for (int i = 0; i < sizeofstring; i++)
            {
                txtbox2.Text += valuesofstring[i];
            }
            //if (newint != 0)
            //{
            //    newint = newint * 143;
            //    txtbox2.Text += newint;
            //}

        }

        public void Encryption2()
        {
            valuesofstring = copyofString.ToArray();
            for (int j = 0; j < sizeofstring; j++)
            {
                switch (valuesofstring[j])
                {
                    case "a":
                        valuesofstring[j] = "01b1dW";
                        break;
                    case "b":
                        valuesofstring[j] = "f1e10A";
                        break;
                    case "c":
                        valuesofstring[j] = "#1f2qR";
                        break;
                    case "d":
                        valuesofstring[j] = "g$11$e";
                        break;
                    case "e":
                        valuesofstring[j] = "s%01TU";
                        break;
                    case "f":
                        valuesofstring[j] = "1@J10!";
                        break;
                    case "g":
                        valuesofstring[j] = "#tB23R";
                        break;
                    case "h":
                        valuesofstring[j] = "#dH@cQ";
                        break;
                    case "i":
                        valuesofstring[j] = "1c%hiQ";
                        break;
                    case "j":
                        valuesofstring[j] = "Zi01nb";
                        break;
                    case "k":
                        valuesofstring[j] = "01$dW!";
                        break;
                    case "l":
                        valuesofstring[j] = "1mH#2!";
                        break;
                    case "m":
                        valuesofstring[j] = "@F11ET";
                        break;
                    case "n":
                        valuesofstring[j] = "%fTx11";
                        break;
                    case "o":
                        valuesofstring[j] = "10$C0@";
                        break;
                    case "p":
                        valuesofstring[j] = "A#!eNg";
                        break;
                    case "q":
                        valuesofstring[j] = "VX#F@1";
                        break;
                    case "r":
                        valuesofstring[j] = "w$R11@";
                        break;
                    case "s":
                        valuesofstring[j] = "DC2t10";
                        break;
                    case "t":
                        valuesofstring[j] = "W@!e2G";
                        break;
                    case "u":
                        valuesofstring[j] = "11D$ei";
                        break;
                    case "v":
                        valuesofstring[j] = "G$1#fs";
                        break;
                    case "w":
                        valuesofstring[j] = "Bg10#c";
                        break;
                    case "x":
                        valuesofstring[j] = "#VS$OP";
                        break;
                    case "y":
                        valuesofstring[j] = "Nv#10F";
                        break;
                    case "z":
                        valuesofstring[j] = "cfPj1@";
                        break;


                    case "A":
                        valuesofstring[j] = "$###$$#";
                        break;
                    case "B":
                        valuesofstring[j] = "#$#$$$$";
                        break;
                    case "C":
                        valuesofstring[j] = "$$#$##$";
                        break;
                    case "D":
                        valuesofstring[j] = "#$$##$#";
                        break;
                    case "E":
                        valuesofstring[j] = "#$$$#$$";
                        break;
                    case "F":
                        valuesofstring[j] = "$$#$#$$";
                        break;
                    case "G":
                        valuesofstring[j] = "###$#$#";
                        break;
                    case "H":
                        valuesofstring[j] = "$##$#$#";
                        break;
                    case "I":
                        valuesofstring[j] = "#$$#$$#";
                        break;
                    case "J":
                        valuesofstring[j] = "$$#$$#$";
                        break;
                    case "K":
                        valuesofstring[j] = "##$$#$#";
                        break;
                    case "L":
                        valuesofstring[j] = "##$#$#$";
                        break;
                    case "M":
                        valuesofstring[j] = "$##$##$";
                        break;
                    case "N":
                        valuesofstring[j] = "$##$$#$";
                        break;
                    case "O":
                        valuesofstring[j] = "#$$#$##";
                        break;
                    case "P":
                        valuesofstring[j] = "###$$$#";
                        break;
                    case "Q":
                        valuesofstring[j] = "$#$$#$#";
                        break;
                    case "R":
                        valuesofstring[j] = "$$###$#";
                        break;
                    case "S":
                        valuesofstring[j] = "####$$#";
                        break;
                    case "T":
                        valuesofstring[j] = "$#$##$#";
                        break;
                    case "U":
                        valuesofstring[j] = "#$$$$#$";
                        break;
                    case "V":
                        valuesofstring[j] = "#$##$$$";
                        break;
                    case "W":
                        valuesofstring[j] = "$#####$";
                        break;
                    case "X":
                        valuesofstring[j] = "$$###$$";
                        break;
                    case "Y":
                        valuesofstring[j] = "###$#$$";
                        break;
                    case "Z":
                        valuesofstring[j] = "$$$$$##";
                        break;


                    case "1":
                        valuesofstring[j] = "H#3Qw!";
                        break;
                    case "2":
                        valuesofstring[j] = "!v2Df#";
                        break;
                    case "3":
                        valuesofstring[j] = "@tQmI1";
                        break;
                    case "4":
                        valuesofstring[j] = "#110D$";
                        break;
                    case "5":
                        valuesofstring[j] = "Q11010";
                        break;
                    case "6":
                        valuesofstring[j] = "Fw12#q";
                        break;
                    case "7":
                        valuesofstring[j] = "Si@TD1";
                        break;
                    case "8":
                        valuesofstring[j] = "TxZ@#1";
                        break;
                    case "9":
                        valuesofstring[j] = "GeT#10";
                        break;
                    case "0":
                        valuesofstring[j] = "C@m0P#";
                        break;
                    case "!":
                        valuesofstring[j] = "J3u#10";
                        break;
                    case "#":
                        valuesofstring[j] = "Wd$lp1";
                        break;
                    case "@":
                        valuesofstring[j] = "01$sjn";
                        break;
                    case "$":
                        valuesofstring[j] = "qvR112";
                        break;
                    case "&":
                        valuesofstring[j] = "101@11";
                        break;
                    case "*":
                        valuesofstring[j] = "1$xcDe";
                        break;
                    case "^":
                        valuesofstring[j] = "!eOpqB";
                        break;
                    case "-":
                        valuesofstring[j] = "L$210W";
                        break;
                    case "_":
                        valuesofstring[j] = "dF11lp";
                        break;
                    case ")":
                        valuesofstring[j] = "cDn10#";
                        break;
                    case ";":
                        valuesofstring[j] = "$s1!lc";
                        break;
                    case ",":
                        valuesofstring[j] = "t#$11Z";
                        break;
                    case "|":
                        valuesofstring[j] = "S112@#";
                        break;
                    case "+":
                        valuesofstring[j] = "G#1!01";
                        break;
                    case "~":
                        valuesofstring[j] = "Ql!10e";
                        break;
                    case "/":
                        valuesofstring[j] = "DBb12@";
                        break;
                    case "<":
                        valuesofstring[j] = "Xkp1%s";
                        break;
                    case ">":
                        valuesofstring[j] = "xcQDft";
                        break;
                    case "?":
                        valuesofstring[j] = "gfw11@";
                        break;
                    case "=":
                        valuesofstring[j] = "1@w101";
                        break;

                }
            }

            for (int i = 0; i < sizeofstring; i++)
            {
                txtbox2.Text += valuesofstring[i];
            }
            //if (newint != 0)
            //{
            //    newint = newint * 143;
            //    txtbox2.Text += newint;
            //}

        }
        public void Encryption3()
        {
            valuesofstring = copyofString.ToArray();
            for (int j = 0; j < sizeofstring; j++)
            {
                switch (valuesofstring[j])
                {
                    case "a":
                        valuesofstring[j] = "0111101";
                        break;
                    case "b":
                        valuesofstring[j] = "0010101";
                        break;
                    case "c":
                        valuesofstring[j] = "1000110";
                        break;
                    case "d":
                        valuesofstring[j] = "1100011";
                        break;
                    case "e":
                        valuesofstring[j] = "0101011";
                        break;
                    case "f":
                        valuesofstring[j] = "0001011";
                        break;
                    case "g":
                        valuesofstring[j] = "1010110";
                        break;
                    case "h":
                        valuesofstring[j] = "1011010";
                        break;
                    case "i":
                        valuesofstring[j] = "1011111";
                        break;
                    case "j":
                        valuesofstring[j] = "1101000";
                        break;
                    case "k":
                        valuesofstring[j] = "1101101";
                        break;
                    case "l":
                        valuesofstring[j] = "1110111";
                        break;
                    case "m":
                        valuesofstring[j] = "1010001";
                        break;
                    case "n":
                        valuesofstring[j] = "0111010";
                        break;
                    case "o":
                        valuesofstring[j] = "1001010";
                        break;
                    case "p":
                        valuesofstring[j] = "1111101";
                        break;
                    case "q":
                        valuesofstring[j] = "0101110";
                        break;
                    case "r":
                        valuesofstring[j] = "0110000";
                        break;
                    case "s":
                        valuesofstring[j] = "1011101";
                        break;
                    case "t":
                        valuesofstring[j] = "1011001";
                        break;
                    case "u":
                        valuesofstring[j] = "0010111";
                        break;
                    case "v":
                        valuesofstring[j] = "1010010";
                        break;
                    case "w":
                        valuesofstring[j] = "1101001";
                        break;
                    case "x":
                        valuesofstring[j] = "1001110";
                        break;
                    case "y":
                        valuesofstring[j] = "1111110";
                        break;
                    case "z":
                        valuesofstring[j] = "1000001";
                        break;


                    case "A":
                        valuesofstring[j] = "1101110";
                        break;
                    case "B":
                        valuesofstring[j] = "0111100";
                        break;
                    case "C":
                        valuesofstring[j] = "0010100";
                        break;
                    case "D":
                        valuesofstring[j] = "1110001";
                        break;
                    case "E":
                        valuesofstring[j] = "1110100";
                        break;
                    case "F":
                        valuesofstring[j] = "1010100";
                        break;
                    case "G":
                        valuesofstring[j] = "0100100";
                        break;
                    case "H":
                        valuesofstring[j] = "0001111";
                        break;
                    case "I":
                        valuesofstring[j] = "0011001";
                        break;
                    case "J":
                        valuesofstring[j] = "1111000";
                        break;
                    case "K":
                        valuesofstring[j] = "0100101";
                        break;
                    case "L":
                        valuesofstring[j] = "0101101";
                        break;
                    case "M":
                        valuesofstring[j] = "0110111";
                        break;
                    case "N":
                        valuesofstring[j] = "1101100";
                        break;
                    case "O":
                        valuesofstring[j] = "0111111";
                        break;
                    case "P":
                        valuesofstring[j] = "0111110";
                        break;
                    case "Q":
                        valuesofstring[j] = "1111100";
                        break;
                    case "R":
                        valuesofstring[j] = "0101100";
                        break;
                    case "S":
                        valuesofstring[j] = "0011100";
                        break;
                    case "T":
                        valuesofstring[j] = "0110100";
                        break;
                    case "U":
                        valuesofstring[j] = "0101001";
                        break;
                    case "V":
                        valuesofstring[j] = "1000100";
                        break;
                    case "W":
                        valuesofstring[j] = "0101111";
                        break;
                    case "X":
                        valuesofstring[j] = "0000001";
                        break;
                    case "Y":
                        valuesofstring[j] = "0000110";
                        break;
                    case "Z":
                        valuesofstring[j] = "0100010";
                        break;

                    case "1":
                        valuesofstring[j] = "1000111";
                        break;
                    case "2":
                        valuesofstring[j] = "1011011";
                        break;
                    case "3":
                        valuesofstring[j] = "0001010";
                        break;
                    case "4":
                        valuesofstring[j] = "1010101";
                        break;
                    case "5":
                        valuesofstring[j] = "0100011";
                        break;
                    case "6":
                        valuesofstring[j] = "0000010";
                        break;
                    case "7":
                        valuesofstring[j] = "0000110";
                        break;
                    case "8":
                        valuesofstring[j] = "0101001";
                        break;
                    case "9":
                        valuesofstring[j] = "1000101";
                        break;
                    case "0":
                        valuesofstring[j] = "0111100";
                        break;
                    case "!":
                        valuesofstring[j] = "0110100";
                        break;
                    case "#":
                        valuesofstring[j] = "0011100";
                        break;
                    case "@":
                        valuesofstring[j] = "0101100";
                        break;
                    case "$":
                        valuesofstring[j] = "1111100";
                        break;
                    case "&":
                        valuesofstring[j] = "0111110";
                        break;
                    case "*":
                        valuesofstring[j] = "0111111";
                        break;
                    case "^":
                        valuesofstring[j] = "1101100";
                        break;
                    case "-":
                        valuesofstring[j] = "0010100";
                        break;
                    case "_":
                        valuesofstring[j] = "0101101";
                        break;
                    case ")":
                        valuesofstring[j] = "0100000";
                        break;
                    case ";":
                        valuesofstring[j] = "1111001";
                        break;
                    case ",":
                        valuesofstring[j] = "0011111";
                        break;
                    case "|":
                        valuesofstring[j] = "0001100";
                        break;
                    case "+":
                        valuesofstring[j] = "0100100";
                        break;
                    case "~":
                        valuesofstring[j] = "1010100";
                        break;
                    case "/":
                        valuesofstring[j] = "1110100";
                        break;
                    case "<":
                        valuesofstring[j] = "1110110";
                        break;
                    case ">":
                        valuesofstring[j] = "0010110";
                        break;
                    case "?":
                        valuesofstring[j] = "0111000";
                        break;
                    case "=":
                        valuesofstring[j] = "1101010";
                        break;
                }
            }

            for (int i = 0; i < sizeofstring; i++)
            {
                txtbox2.Text += valuesofstring[i];
            }
            //if (newint != 0)
            //{
            //    newint = newint * 143;
            //    txtbox2.Text += newint;
            //}

        }

        public void Encryption4()
        {
            valuesofstring = copyofString.ToArray();
            for (int j = 0; j < sizeofstring; j++)
            {
                switch (valuesofstring[j])
                {
                    case "a":
                        valuesofstring[j] = "w109oXV010";
                        break;
                    case "b":
                        valuesofstring[j] = "Ha3#101rYt";
                        break;
                    case "c":
                        valuesofstring[j] = "00VHA80wTo";
                        break;
                    case "d":
                        valuesofstring[j] = "1A#6df00ew";
                        break;
                    case "e":
                        valuesofstring[j] = "11QudkF0lo";
                        break;
                    case "f":
                        valuesofstring[j] = "0H4jpqP$li";
                        break;
                    case "g":
                        valuesofstring[j] = "0110A0o@9#";
                        break;
                    case "h":
                        valuesofstring[j] = "#1Vgk46u8F";
                        break;
                    case "i":
                        valuesofstring[j] = "3zA*rlw1d@";
                        break;
                    case "j":
                        valuesofstring[j] = "1@hsQ%2kp0";
                        break;
                    case "k":
                        valuesofstring[j] = "3$Fk010D11";
                        break;
                    case "l":
                        valuesofstring[j] = "Coe!O1$h&0";
                        break;
                    case "m":
                        valuesofstring[j] = "10Ep$Dx!8u";
                        break;
                    case "n":
                        valuesofstring[j] = "T!x%ui#11A";
                        break;
                    case "o":
                        valuesofstring[j] = "Aj#4TqlZ3@";
                        break;
                    case "p":
                        valuesofstring[j] = "00O$CkXHq8";
                        break;
                    case "q":
                        valuesofstring[j] = "4$D11Ysw0a";
                        break;
                    case "r":
                        valuesofstring[j] = "11#vIlq5!M";
                        break;
                    case "s":
                        valuesofstring[j] = "N010e8D#z&";
                        break;
                    case "t":
                        valuesofstring[j] = "j8o2Fz$ai@";
                        break;
                    case "u":
                        valuesofstring[j] = "1101Dm#pew";
                        break;
                    case "v":
                        valuesofstring[j] = "F4#hs01#qL";
                        break;
                    case "w":
                        valuesofstring[j] = "F@hCp11s0z";
                        break;
                    case "x":
                        valuesofstring[j] = "10Uxfb6wNe";
                        break;
                    case "y":
                        valuesofstring[j] = "nB&c10$1#e";
                        break;
                    case "z":
                        valuesofstring[j] = "m*a10uGs#i";
                        break;



                    case "A":
                        valuesofstring[j] = "10UxfnB&c1";
                        break;
                    case "B":
                        valuesofstring[j] = "m*a100$1#e";
                        break;
                    case "C":
                        valuesofstring[j] = "b6wNeuGs#i";
                        break;
                    case "D":
                        valuesofstring[j] = "jpBs1l10%s";
                        break;
                    case "E":
                        valuesofstring[j] = "Pc11xyNlxt";
                        break;
                    case "F":
                        valuesofstring[j] = "02WnyaFa8%";
                        break;
                    case "G":
                        valuesofstring[j] = "M4lex08oEq";
                        break;
                    case "H":
                        valuesofstring[j] = "8Hdi1pctdZ";
                        break;
                    case "I":
                        valuesofstring[j] = "10X!dPabiE";
                        break;
                    case "J":
                        valuesofstring[j] = "SpnfOpt%Zw";
                        break;
                    case "K":
                        valuesofstring[j] = "011100#Sic";
                        break;
                    case "L":
                        valuesofstring[j] = "%Dvyx01D1#";
                        break;
                    case "M":
                        valuesofstring[j] = "F4ciXlksd0";
                        break;
                    case "N":
                        valuesofstring[j] = "tpk1X1@Rdm";
                        break;
                    case "O":
                        valuesofstring[j] = "vSlocs8Dwc";
                        break;
                    case "P":
                        valuesofstring[j] = "GScq0#11np";
                        break;
                    case "Q":
                        valuesofstring[j] = "dEqdcjE#01";
                        break;
                    case "R":
                        valuesofstring[j] = "kdKx1100#s";
                        break;
                    case "S":
                        valuesofstring[j] = "Fxd11calLe";
                        break;
                    case "T":
                        valuesofstring[j] = "11kXdgJbTp";
                        break;
                    case "U":
                        valuesofstring[j] = "dcVs@1oSz!";
                        break;
                    case "V":
                        valuesofstring[j] = "#F1eJ#svJp";
                        break;
                    case "W":
                        valuesofstring[j] = "Ude10%hcQ!";
                        break;
                    case "X":
                        valuesofstring[j] = "cv01k0o18W";
                        break;
                    case "Y":
                        valuesofstring[j] = "ho!eTDt0j@";
                        break;
                    case "Z":
                        valuesofstring[j] = "2vGmd01%Hz";
                        break;
                    
                    
                    case "1":
                        valuesofstring[j] = "jpBs101%Hz";
                        break;
                    case "2":
                        valuesofstring[j] = "Pc11xDt0j@";
                        break;
                    case "3":
                        valuesofstring[j] = "01Eqk0o18W";
                        break;
                    case "4":
                        valuesofstring[j] = "02Fny%hcQ!";
                        break;
                    case "5":
                        valuesofstring[j] = "M4lex#svJp";
                        break;
                    case "6":
                        valuesofstring[j] = "8Hdi11oSz!";
                        break;
                    case "7":
                        valuesofstring[j] = "10X!dgJbTp";
                        break;
                    case "8":
                        valuesofstring[j] = "SpnfOcalLe";
                        break;
                    case "9":
                        valuesofstring[j] = "01110100#s";
                        break;
                    case "0":
                        valuesofstring[j] = "%DvyxjE#01";
                        break;
                    case "!":
                        valuesofstring[j] = "F4ciM#11np";
                        break;
                    case "#":
                        valuesofstring[j] = "tpk1Xs8Dwc";
                        break;
                    case "@":
                        valuesofstring[j] = "vSloc!pGdW";
                        break;
                    case "$":
                        valuesofstring[j] = "GScq01@Rdm";
                        break;
                    case "&":
                        valuesofstring[j] = "dEqdclksd0";
                        break;
                    case "*":
                        valuesofstring[j] = "kdKx101D1#";
                        break;
                    case "^":
                        valuesofstring[j] = "Fxd110#Sic";
                        break;
                    case "-":
                        valuesofstring[j] = "11kXdpt%Zw";
                        break;
                    case "_":
                        valuesofstring[j] = "dcVs@PabiE";
                        break;
                    case ")":
                        valuesofstring[j] = "#F1eJpctdZ";
                        break;
                    case ";":
                        valuesofstring[j] = "Ude1008oEq";
                        break;
                    case ",":
                        valuesofstring[j] = "cv01kaFa8%";
                        break;
                    case "|":
                        valuesofstring[j] = "f!8DzAdYl1";
                        break;
                    case "+":
                        valuesofstring[j] = "ho!eTyNlxt";
                        break;
                    case "~":
                        valuesofstring[j] = "2vGmdl10%s";
                        break;
                    case "/":
                        valuesofstring[j] = "nDxc10%hqm";
                        break;
                    case "<":
                        valuesofstring[j] = "sX!jw1f10N";
                        break;
                    case ">":
                        valuesofstring[j] = "Lpzu110$i#";
                        break;
                    case "?":
                        valuesofstring[j] = "@Epd%81Tfs";
                        break;
                    case "=":
                        valuesofstring[j] = "Hb8%6!fLox";
                        break;

                }
            }

            for (int i = 0; i < sizeofstring; i++)
            {
                txtbox2.Text += valuesofstring[i];
            }
            //if (newint != 0)
            //{
            //    newint = newint * 143;
            //    txtbox2.Text += newint;
            //}

        }

        public void Decryption1()
        {

            sd = txtbox1.Text.Length;
            if (sd == 0)
            {
                //encrypt();
                //int arrc=0;
                decryptString1 = txtbox2.Text.Trim();
                second3 = txtbox2.Text.Trim();
                //for (int i = 0; i < second3.Length; i++)
                //{


                //string str = "111122223333444455";
                int chunkSize = 7;
                int stringLength = second3.Length;
                for (int j = 0; j < stringLength; j += chunkSize)
                {
                    if (j + chunkSize > stringLength) chunkSize = stringLength - j;

                    //MessageBox.Show(second3.Substring(j, chunkSize));

                    if (second3.Substring(j, chunkSize).Contains("$####$#"))
                    //if (second3.Contains("%100%"))
                    {

                        txtbox3.Text += 'a';

                        //second3.Remove(0, 5);
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$#$#$#"))
                    //if (second3.Contains("+-00+"))
                    {
                        txtbox3.Text += 'b';

                        //  second3.Remove(6, 11);
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$$$##$"))
                    //if (second3.Contains("&*()-"))
                    {
                        txtbox3.Text += 'c';

                    }
                    if (second3.Substring(j, chunkSize).Contains("##$$$##"))
                    //if (second3.Contains("^890+"))
                    {
                        txtbox3.Text += 'd';

                    }
                    if (second3.Substring(j, chunkSize).Contains("$#$#$##"))
                    //if (second3.Contains("$%001"))
                    {
                        txtbox3.Text += 'e';

                    }
                    if (second3.Substring(j, chunkSize).Contains("$$$#$##"))
                    //if (second3.Contains("@!11*"))
                    {

                        txtbox3.Text += 'f';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$#$##$"))
                    // if (second3.Contains("+-%#"))
                    {
                        txtbox3.Text += 'g';

                    }
                    if (second3.Substring(j, chunkSize).Contains("#$##$#$"))
                    //if (second3.Contains(";a41"))
                    {
                        txtbox3.Text += 'h';

                    }
                    if (second3.Substring(j, chunkSize).Contains("#$#####"))
                    //if (second3.Contains("111#"))
                    {
                        txtbox3.Text += 'i';

                    }
                    if (second3.Substring(j, chunkSize).Contains("##$#$$$"))
                    // if (second3.Contains("00&1"))
                    {
                        txtbox3.Text += 'j';

                    }
                    if (second3.Substring(j, chunkSize).Contains("##$##$#"))
                    //  if (second3.Contains("@`!*"))
                    {
                        txtbox3.Text += 'k';

                    }
                    if (second3.Substring(j, chunkSize).Contains("###$###"))
                    //  if (second3.Contains("*101$"))
                    {
                        txtbox3.Text += 'l';

                    }
                    if (second3.Substring(j, chunkSize).Contains("#$#$$$#"))
                    //if (second3.Contains("$@+1"))
                    {
                        txtbox3.Text += 'm';

                    }
                    if (second3.Substring(j, chunkSize).Contains("$###$#$"))
                    //if (second3.Contains("^1*&"))
                    {
                        txtbox3.Text += 'n';

                    }
                    if (second3.Substring(j, chunkSize).Contains("#$$#$#$"))
                    // if (second3.Contains("/</1"))
                    {
                        txtbox3.Text += 'o';

                    }
                    if (second3.Substring(j, chunkSize).Contains("#####$#"))
                    //   if (second3.Contains("1~99"))
                    {
                        txtbox3.Text += 'p';

                    }
                    if (second3.Substring(j, chunkSize).Contains("$#$###$"))
                    // if (second3.Contains("2&8#"))
                    {
                        txtbox3.Text += 'q';

                    }
                    if (second3.Substring(j, chunkSize).Contains("$##$$$$"))
                    // if (second3.Contains("(*@!"))
                    {
                        txtbox3.Text += 'r';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$###$#"))
                    //if (second3.Contains("[^1^"))
                    {
                        txtbox3.Text += 's';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$##$$#"))
                    // if (second3.Contains("}\\7"))
                    {
                        txtbox3.Text += 't';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$#$###"))
                    //if (second3.Contains("90+1"))
                    {
                        txtbox3.Text += 'u';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$#$$#$"))
                    //if (second3.Contains("/j!@"))
                    {
                        txtbox3.Text += 'v';
                    }
                    if (second3.Substring(j, chunkSize).Contains("##$#$$#"))
                    //if (second3.Contains("]-*("))
                    {
                        txtbox3.Text += 'w';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$$###$"))
                    //if (second3.Contains("!)-+"))
                    {
                        txtbox3.Text += 'x';
                    }
                    if (second3.Substring(j, chunkSize).Contains("######$"))
                    //if (second3.Contains("1111"))
                    {
                        txtbox3.Text += 'y';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$$$$$#"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += 'z';
                    }


                    if (second3.Substring(j, chunkSize).Contains("$###$$#"))
                    //if (second3.Contains("%100%"))
                    {

                        txtbox3.Text += 'A';

                        //second3.Remove(0, 5);
                    }
                    if (second3.Substring(j, chunkSize).Contains("$###$$#"))
                    //if (second3.Contains("+-00+"))
                    {
                        txtbox3.Text += 'B';

                        //  second3.Remove(6, 11);
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$#$##$"))
                    //if (second3.Contains("&*()-"))
                    {
                        txtbox3.Text += 'C';

                    }
                    if (second3.Substring(j, chunkSize).Contains("#$$##$#"))
                    //if (second3.Contains("^890+"))
                    {
                        txtbox3.Text += 'D';

                    }
                    if (second3.Substring(j, chunkSize).Contains("#$$$#$$"))
                    //if (second3.Contains("$%001"))
                    {
                        txtbox3.Text += 'E';

                    }
                    if (second3.Substring(j, chunkSize).Contains("$$#$#$$"))
                    //if (second3.Contains("@!11*"))
                    {

                        txtbox3.Text += 'F';
                    }
                    if (second3.Substring(j, chunkSize).Contains("###$#$#"))
                    // if (second3.Contains("+-%#"))
                    {
                        txtbox3.Text += 'G';

                    }
                    if (second3.Substring(j, chunkSize).Contains("$##$#$#"))
                    //if (second3.Contains(";a41"))
                    {
                        txtbox3.Text += 'H';

                    }
                    if (second3.Substring(j, chunkSize).Contains("#$$#$$#"))
                    //if (second3.Contains("111#"))
                    {
                        txtbox3.Text += 'I';

                    }
                    if (second3.Substring(j, chunkSize).Contains("$$#$$#$"))
                    // if (second3.Contains("00&1"))
                    {
                        txtbox3.Text += 'J';

                    }
                    if (second3.Substring(j, chunkSize).Contains("##$$#$#"))
                    //  if (second3.Contains("@`!*"))
                    {
                        txtbox3.Text += 'K';

                    }
                    if (second3.Substring(j, chunkSize).Contains("##$#$#$"))
                    //  if (second3.Contains("*101$"))
                    {
                        txtbox3.Text += 'L';

                    }
                    if (second3.Substring(j, chunkSize).Contains("$##$##$"))
                    //if (second3.Contains("$@+1"))
                    {
                        txtbox3.Text += 'M';

                    }
                    if (second3.Substring(j, chunkSize).Contains("$##$$#$"))
                    //if (second3.Contains("^1*&"))
                    {
                        txtbox3.Text += 'N';

                    }
                    if (second3.Substring(j, chunkSize).Contains("#$$#$##"))
                    // if (second3.Contains("/</1"))
                    {
                        txtbox3.Text += 'O';

                    }
                    if (second3.Substring(j, chunkSize).Contains("###$$$#"))
                    //   if (second3.Contains("1~99"))
                    {
                        txtbox3.Text += 'P';

                    }
                    if (second3.Substring(j, chunkSize).Contains("$#$$#$#"))
                    // if (second3.Contains("2&8#"))
                    {
                        txtbox3.Text += 'Q';

                    }
                    if (second3.Substring(j, chunkSize).Contains("$$###$#"))
                    // if (second3.Contains("(*@!"))
                    {
                        txtbox3.Text += 'R';
                    }
                    if (second3.Substring(j, chunkSize).Contains("####$$#"))
                    //if (second3.Contains("[^1^"))
                    {
                        txtbox3.Text += 'S';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$#$##$#"))
                    // if (second3.Contains("}\\7"))
                    {
                        txtbox3.Text += 'T';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$$$$#$"))
                    //if (second3.Contains("90+1"))
                    {
                        txtbox3.Text += 'U';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$##$$$"))
                    //if (second3.Contains("/j!@"))
                    {
                        txtbox3.Text += 'V';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$#####$"))
                    //if (second3.Contains("]-*("))
                    {
                        txtbox3.Text += 'W';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$###$$"))
                    //if (second3.Contains("!)-+"))
                    {
                        txtbox3.Text += 'X';
                    }
                    if (second3.Substring(j, chunkSize).Contains("###$#$$"))
                    //if (second3.Contains("1111"))
                    {
                        txtbox3.Text += 'Y';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$$$$##"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += 'Z';
                    }



                    if (second3.Substring(j, chunkSize).Contains("#$$$###"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '1';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$##$##"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '2';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$$#$#$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '3';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$#$#$#"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '4';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$#$$$##"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '5';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$$$$#$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '6';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$$$##$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '7';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$#$#$$#"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '8';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$$$#$#"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '9';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$####$$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '0';
                    }

                    if (second3.Substring(j, chunkSize).Contains("$##$#$$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '!';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$$####"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '#';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$#$##$$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '@';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#####$$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '$';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$#$$##$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '&';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$######"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '*';
                    }
                    if (second3.Substring(j, chunkSize).Contains("##$##$$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '^';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$$$#$$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '-';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$##$$##"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '_';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$#$$$$$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += ')';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$##$$#"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += ';';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$#####"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += ',';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$$##$$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '|';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$#$$#$$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '+';
                    }
                    if (second3.Substring(j, chunkSize).Contains("#$#$#$$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '~';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$#$#$$$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '/';
                    }
                    if (second3.Substring(j, chunkSize).Contains("###$##$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '<';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$##$#$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '>';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$###$$$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '?';
                    }
                    if (second3.Substring(j, chunkSize).Contains("$$$###$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '=';
                    }


                    //if (newint != 0)
                    //{
                    //    newint = newint / 143;
                    //    txtbox3.Text += newint;
                    //}
                }
            }

            else if (sd != 0)
            {
                two = new List<string>(txtbox2.Text.Length);
                two = valuesofstring.ToList();
                second2 = new string[valuesofstring.Length];
                second2 = two.ToArray();
                // two.Capacity = txtbox2.Text.Length;
                for (int j = 0; j < valuesofstring.Length; j++)
                {
                    switch (second2[j])
                    {

                        case "$####$#":
                            valuesofstring[j] = "a";
                            break;
                        case "$$#$#$#":
                            valuesofstring[j] = "b";
                            break;
                        case "#$$$##$":
                            valuesofstring[j] = "c";
                            break;
                        case "##$$$##":
                            valuesofstring[j] = "d";
                            break;
                        case "$#$#$##":
                            valuesofstring[j] = "e";
                            break;
                        case "$$$#$##":
                            valuesofstring[j] = "f";
                            break;
                        case "#$#$##$":
                            valuesofstring[j] = "g";
                            break;
                        case "#$##$#$":
                            valuesofstring[j] = "h";
                            break;
                        case "#$#####":
                            valuesofstring[j] = "i";
                            break;
                        case "##$#$$$":
                            valuesofstring[j] = "j";
                            break;
                        case "##$##$#":
                            valuesofstring[j] = "k";
                            break;
                        case "###$###":
                            valuesofstring[j] = "l";
                            break;
                        case "#$#$$$#":
                            valuesofstring[j] = "m";
                            break;
                        case "$###$#$":
                            valuesofstring[j] = "n";
                            break;
                        case "#$$#$#$":
                            valuesofstring[j] = "o";
                            break;
                        case "#####$#":
                            valuesofstring[j] = "p";
                            break;
                        case "$#$###$":
                            valuesofstring[j] = "q";
                            break;
                        case "$##$$$$":
                            valuesofstring[j] = "r";
                            break;
                        case "#$###$#":
                            valuesofstring[j] = "s";
                            break;
                        case "#$##$$#":
                            valuesofstring[j] = "t";
                            break;
                        case "$$#$###":
                            valuesofstring[j] = "u";
                            break;
                        case "#$#$$#$":
                            valuesofstring[j] = "v";
                            break;
                        case "##$#$$#":
                            valuesofstring[j] = "w";
                            break;
                        case "#$$###$":
                            valuesofstring[j] = "x";
                            break;
                        case "######$":
                            valuesofstring[j] = "y";
                            break;
                        case "#$$$$$#":
                            valuesofstring[j] = "z";
                            break;

                        case "$###$$#":
                            valuesofstring[j] = "A";
                            break;
                        case "#$#$$$$":
                            valuesofstring[j] = "B";
                            break;
                        case "$$#$##$":
                            valuesofstring[j] = "c";
                            break;
                        case "#$$##$#":
                            valuesofstring[j] = "D";
                            break;
                        case "#$$$#$$":
                            valuesofstring[j] = "E";
                            break;
                        case "$$#$#$$":
                            valuesofstring[j] = "F";
                            break;
                        case "###$#$#":
                            valuesofstring[j] = "G";
                            break;
                        case "$##$#$#":
                            valuesofstring[j] = "H";
                            break;
                        case "#$$#$$#":
                            valuesofstring[j] = "I";
                            break;
                        case "$$#$$#$":
                            valuesofstring[j] = "J";
                            break;
                        case "##$$#$#":
                            valuesofstring[j] = "K";
                            break;
                        case "##$#$#$":
                            valuesofstring[j] = "L";
                            break;
                        case "$##$##$":
                            valuesofstring[j] = "M";
                            break;
                        case "$##$$#$":
                            valuesofstring[j] = "N";
                            break;
                        case "#$$#$##":
                            valuesofstring[j] = "O";
                            break;
                        case "###$$$#":
                            valuesofstring[j] = "P";
                            break;
                        case "$#$$#$#":
                            valuesofstring[j] = "Q";
                            break;
                        case "$$###$#":
                            valuesofstring[j] = "R";
                            break;
                        case "####$$#":
                            valuesofstring[j] = "S";
                            break;
                        case "$#$##$#":
                            valuesofstring[j] = "T";
                            break;
                        case "#$$$$#$":
                            valuesofstring[j] = "U";
                            break;
                        case "#$##$$$":
                            valuesofstring[j] = "V";
                            break;
                        case "$#####$":
                            valuesofstring[j] = "W";
                            break;
                        case "$$###$$":
                            valuesofstring[j] = "X";
                            break;
                        case "###$#$$":
                            valuesofstring[j] = "Y";
                            break;
                        case "$$$$$##":
                            valuesofstring[j] = "Z";
                            break;


                        case "#$$$###":
                            valuesofstring[j] = "1";
                            break;
                        case "#$##$##":
                            valuesofstring[j] = "2";
                            break;
                        case "$$$#$#$":
                            valuesofstring[j] = "3";
                            break;
                        case "#$#$#$#":
                            valuesofstring[j] = "4";
                            break;
                        case "$#$$$##":
                            valuesofstring[j] = "5";
                            break;
                        case "$$$$$#$":
                            valuesofstring[j] = "6";
                            break;
                        case "$$$$##$":
                            valuesofstring[j] = "7";
                            break;
                        case "$#$#$$#":
                            valuesofstring[j] = "8";
                            break;
                        case "#$$$#$#":
                            valuesofstring[j] = "9";
                            break;
                        case "$####$$":
                            valuesofstring[j] = "0";
                            break;
                        case "$##$#$$":
                            valuesofstring[j] = "!";
                            break;
                        case "#$$####":
                            valuesofstring[j] = "#";
                            break;
                        case "$#$##$$":
                            valuesofstring[j] = "@";
                            break;
                        case "#####$$":
                            valuesofstring[j] = "$";
                            break;
                        case "$#$$##$":
                            valuesofstring[j] = "&";
                            break;
                        case "$######":
                            valuesofstring[j] = "*";
                            break;
                        case "##$##$$":
                            valuesofstring[j] = "^";
                            break;
                        case "$$$$#$$":
                            valuesofstring[j] = "-";
                            break;
                        case "$##$$##":
                            valuesofstring[j] = "_";
                            break;
                        case "$#$$$$$":
                            valuesofstring[j] = ")";
                            break;
                        case "$$##$$#":
                            valuesofstring[j] = ";";
                            break;
                        case "$$#####":
                            valuesofstring[j] = ",";
                            break;
                        case "$$$##$$":
                            valuesofstring[j] = "|";
                            break;
                        case "$#$$#$$":
                            valuesofstring[j] = "+";
                            break;
                        case "#$#$#$$":
                            valuesofstring[j] = "~";
                            break;
                        case "$#$#$$$":
                            valuesofstring[j] = "/";
                            break;
                        case "###$##$":
                            valuesofstring[j] = "<";
                            break;
                        case "$$##$#$":
                            valuesofstring[j] = ">";
                            break;
                        case "$###$$$":
                            valuesofstring[j] = "?";
                            break;
                        case "$$$###$":
                            valuesofstring[j] = "=";
                            break;
                    }

                    txtbox3.Text += valuesofstring[j];
                }

                //if (newint != 0)
                //{
                //    newint = newint / 143;
                //    txtbox3.Text += newint;
                //}
                //txtbox3.Text += newint / 143;
            }
        }




        public void Decryption2()
        {

            sd2 = txtbox1.Text.Length;
            if (sd2 == 0)
            {
                //encrypt();
                //int arrc=0;
                decryptString12 = txtbox2.Text.Trim();
                second32 = txtbox2.Text.Trim();

                //int chunkSize = 4;
                //int stringLength = second32.Length;
                //for (int j = 0; j < stringLength; j += chunkSize)
                //{
                //    if (j + chunkSize > stringLength) chunkSize = stringLength - j;
                int chunkSize = 6;
                int stringLength2 = second32.Length;
                for (int j = 0; j < stringLength2; j += chunkSize)
                {
                    if (j + chunkSize > stringLength2) chunkSize = stringLength2 - j;

                    //MessageBox.Show(second3.Substring(j, chunkSize));

                    if (second32.Substring(j, chunkSize).Contains("01b1dW"))
                    //if (second3.Contains("%100%"))
                    {

                        txtbox3.Text += 'a';

                        //second3.Remove(0, 5);
                    }
                    if (second32.Substring(j, chunkSize).Contains("f1e10A"))
                    //if (second3.Contains("+-00+"))
                    {
                        txtbox3.Text += 'b';

                        //  second3.Remove(6, 11);
                    }
                    if (second32.Substring(j, chunkSize).Contains("f1e10A"))
                    //if (second3.Contains("&*()-"))
                    {
                        txtbox3.Text += 'c';

                    }
                    if (second32.Substring(j, chunkSize).Contains("g$11$e"))
                    //if (second3.Contains("^890+"))
                    {
                        txtbox3.Text += 'd';

                    }
                    if (second32.Substring(j, chunkSize).Contains("s%01TU"))
                    //if (second3.Contains("$%001"))
                    {
                        txtbox3.Text += 'e';

                    }
                    if (second32.Substring(j, chunkSize).Contains("1@J10!"))
                    //if (second3.Contains("@!11*"))
                    {

                        txtbox3.Text += 'f';
                    }
                    if (second32.Substring(j, chunkSize).Contains("#tB23R"))
                    // if (second3.Contains("+-%#"))
                    {
                        txtbox3.Text += 'g';

                    }
                    if (second32.Substring(j, chunkSize).Contains("#dH@cQ"))
                    //if (second3.Contains(";a41"))
                    {
                        txtbox3.Text += 'h';

                    }
                    if (second32.Substring(j, chunkSize).Contains("1c%hiQ"))
                    //if (second3.Contains("111#"))
                    {
                        txtbox3.Text += 'i';

                    }
                    if (second32.Substring(j, chunkSize).Contains("Zi01nb"))
                    // if (second3.Contains("00&1"))
                    {
                        txtbox3.Text += 'j';

                    }
                    if (second32.Substring(j, chunkSize).Contains("01$dW!"))
                    //  if (second3.Contains("@`!*"))
                    {
                        txtbox3.Text += 'k';

                    }
                    if (second32.Substring(j, chunkSize).Contains("1mH#2!"))
                    //  if (second3.Contains("*101$"))
                    {
                        txtbox3.Text += 'l';

                    }
                    if (second32.Substring(j, chunkSize).Contains("@F11ET"))
                    //if (second3.Contains("$@+1"))
                    {
                        txtbox3.Text += 'm';

                    }
                    if (second32.Substring(j, chunkSize).Contains("%fTx11"))
                    //if (second3.Contains("^1*&"))
                    {
                        txtbox3.Text += 'n';

                    }
                    if (second32.Substring(j, chunkSize).Contains("10$C0@"))
                    // if (second3.Contains("/</1"))
                    {
                        txtbox3.Text += 'o';

                    }
                    if (second32.Substring(j, chunkSize).Contains("A#!eNg"))
                    //   if (second3.Contains("1~99"))
                    {
                        txtbox3.Text += 'p';

                    }
                    if (second32.Substring(j, chunkSize).Contains("VX#F@1"))
                    // if (second3.Contains("2&8#"))
                    {
                        txtbox3.Text += 'q';

                    }
                    if (second32.Substring(j, chunkSize).Contains("w$R11@"))
                    // if (second3.Contains("(*@!"))
                    {
                        txtbox3.Text += 'r';
                    }
                    if (second32.Substring(j, chunkSize).Contains("DC2t10"))
                    //if (second3.Contains("[^1^"))
                    {
                        txtbox3.Text += 's';
                    }
                    if (second32.Substring(j, chunkSize).Contains("W@!e2G"))
                    // if (second3.Contains("}\\7"))
                    {
                        txtbox3.Text += 't';
                    }
                    if (second32.Substring(j, chunkSize).Contains("11D$ei"))
                    //if (second3.Contains("90+1"))
                    {
                        txtbox3.Text += 'u';
                    }
                    if (second32.Substring(j, chunkSize).Contains("G$1#fs"))
                    //if (second3.Contains("/j!@"))
                    {
                        txtbox3.Text += 'v';
                    }
                    if (second32.Substring(j, chunkSize).Contains("Bg10#c"))
                    //if (second3.Contains("]-*("))
                    {
                        txtbox3.Text += 'w';
                    }
                    if (second32.Substring(j, chunkSize).Contains("#VS$OP"))
                    //if (second3.Contains("!)-+"))
                    {
                        txtbox3.Text += 'x';
                    }
                    if (second32.Substring(j, chunkSize).Contains("Nv#10F"))
                    //if (second3.Contains("1111"))
                    {
                        txtbox3.Text += 'y';
                    }
                    if (second32.Substring(j, chunkSize).Contains("cfPj1@"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += 'z';
                    }

                    if (second32.Substring(j, chunkSize).Contains("H#3Qw!"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '1';
                    }
                    if (second32.Substring(j, chunkSize).Contains("!v2Df#"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '2';
                    }
                    if (second32.Substring(j, chunkSize).Contains("@tQmI1"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '3';
                    }
                    if (second32.Substring(j, chunkSize).Contains("#110D$"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '4';
                    }
                    if (second32.Substring(j, chunkSize).Contains("Q11010"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '5';
                    }
                    if (second32.Substring(j, chunkSize).Contains("Fw12#q"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '6';
                    }
                    if (second32.Substring(j, chunkSize).Contains("Si@TD1"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '7';
                    }
                    if (second32.Substring(j, chunkSize).Contains("TxZ@#1"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '8';
                    }
                    if (second32.Substring(j, chunkSize).Contains("GeT#10"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '9';
                    }
                    if (second32.Substring(j, chunkSize).Contains("C@m0P#"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '0';
                    }
                    if (second32.Substring(j, chunkSize).Contains("J3u#10"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '!';
                    }
                    if (second32.Substring(j, chunkSize).Contains("Wd$lp1"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '#';
                    }
                    if (second32.Substring(j, chunkSize).Contains("01$sjn"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '@';
                    }
                    if (second32.Substring(j, chunkSize).Contains("qvR112"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '$';
                    }
                    if (second32.Substring(j, chunkSize).Contains("101@11"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '&';
                    }
                    if (second32.Substring(j, chunkSize).Contains("1$xcDe"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '*';
                    }
                    if (second32.Substring(j, chunkSize).Contains("!eOpqB"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '^';
                    }
                    if (second32.Substring(j, chunkSize).Contains("L$210W"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '-';
                    }
                    if (second32.Substring(j, chunkSize).Contains("dF11lp"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '_';
                    }
                    if (second32.Substring(j, chunkSize).Contains("cDn10#"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += ')';
                    }
                    if (second32.Substring(j, chunkSize).Contains("$s1!lc"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += ';';
                    }
                    if (second32.Substring(j, chunkSize).Contains("t#$11Z"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += ',';
                    }
                    if (second32.Substring(j, chunkSize).Contains("S112@#"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '|';
                    }
                    if (second32.Substring(j, chunkSize).Contains("G#1!01"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '+';
                    }
                    if (second32.Substring(j, chunkSize).Contains("Ql!10e"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '~';
                    }
                    if (second32.Substring(j, chunkSize).Contains("DBb12@"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '/';
                    }
                    if (second32.Substring(j, chunkSize).Contains("Xkp1%s"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '<';
                    }
                    if (second32.Substring(j, chunkSize).Contains("xcQDft"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '>';
                    }
                    if (second32.Substring(j, chunkSize).Contains("gfw11@"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '?';
                    }
                    if (second32.Substring(j, chunkSize).Contains("1@w101"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '=';
                    }
                    //if (newint != 0)
                    //{
                    //    newint = newint / 143;
                    //    txtbox3.Text += newint;
                    //}
                }
            }

            else if (sd2 != 0)
            {
                two2 = new List<string>(txtbox2.Text.Length);
                two2 = valuesofstring.ToList();
                second22 = new string[valuesofstring.Length];
                second22 = two2.ToArray();
                // two.Capacity = txtbox2.Text.Length;
                for (int j = 0; j < valuesofstring.Length; j++)
                {
                    switch (second22[j])
                    {
                        case "01b1dW":
                            valuesofstring[j] = "a";
                            break;
                        case "f1e10A":
                            valuesofstring[j] = "b";
                            break;
                        case "#1f2qR":
                            valuesofstring[j] = "c";
                            break;
                        case "g$11$e":
                            valuesofstring[j] = "d";
                            break;
                        case "s%01TU":
                            valuesofstring[j] = "e";
                            break;
                        case "1@J10!":
                            valuesofstring[j] = "f";
                            break;
                        case "#tB23R":
                            valuesofstring[j] = "g";
                            break;
                        case "#dH@cQ":
                            valuesofstring[j] = "h";
                            break;
                        case "1c%hiQ":
                            valuesofstring[j] = "i";
                            break;
                        case "Zi01nb":
                            valuesofstring[j] = "j";
                            break;
                        case "01$dW!":
                            valuesofstring[j] = "k";
                            break;
                        case "1mH#2!":
                            valuesofstring[j] = "l";
                            break;
                        case "@F11ET":
                            valuesofstring[j] = "m";
                            break;
                        case "%fTx11":
                            valuesofstring[j] = "n";
                            break;
                        case "10$C0@":
                            valuesofstring[j] = "o";
                            break;
                        case "A#!eNg":
                            valuesofstring[j] = "p";
                            break;
                        case "VX#F@1":
                            valuesofstring[j] = "q";
                            break;
                        case "w$R11@":
                            valuesofstring[j] = "r";
                            break;
                        case "DC2t10":
                            valuesofstring[j] = "s";
                            break;
                        case "W@!e2G":
                            valuesofstring[j] = "t";
                            break;
                        case "11D$ei":
                            valuesofstring[j] = "u";
                            break;
                        case "G$1#fs":
                            valuesofstring[j] = "v";
                            break;
                        case "Bg10#c":
                            valuesofstring[j] = "w";
                            break;
                        case "#VS$OP":
                            valuesofstring[j] = "x";
                            break;
                        case "Nv#10F":
                            valuesofstring[j] = "y";
                            break;
                        case "cfPj1@":
                            valuesofstring[j] = "z";
                            break;
                        case "H#3Qw!":
                            valuesofstring[j] = "1";
                            break;
                        case "!v2Df#":
                            valuesofstring[j] = "2";
                            break;
                        case "@tQmI1":
                            valuesofstring[j] = "3";
                            break;
                        case "#110D$":
                            valuesofstring[j] = "4";
                            break;
                        case "Q11010":
                            valuesofstring[j] = "5";
                            break;
                        case "Fw12#q":
                            valuesofstring[j] = "6";
                            break;
                        case "Si@TD1":
                            valuesofstring[j] = "7";
                            break;
                        case "TxZ@#1":
                            valuesofstring[j] = "8";
                            break;
                        case "GeT#10":
                            valuesofstring[j] = "9";
                            break;
                        case "C@m0P#":
                            valuesofstring[j] = "0";
                            break;

                        case "J3u#10":
                            valuesofstring[j] = "!";
                            break;
                        case "Wd$lp1":
                            valuesofstring[j] = "#";
                            break;
                        case "01$sjn":
                            valuesofstring[j] = "@";
                            break;
                        case "qvR112":
                            valuesofstring[j] = "$";
                            break;
                        case "101@11":
                            valuesofstring[j] = "&";
                            break;
                        case "1$xcDe":
                            valuesofstring[j] = "*";
                            break;
                        case "!eOpqB":
                            valuesofstring[j] = "^";
                            break;
                        case "L$210W":
                            valuesofstring[j] = "-";
                            break;
                        case "dF11lp":
                            valuesofstring[j] = "_";
                            break;
                        case "cDn10#":
                            valuesofstring[j] = ")";
                            break;
                        case "$s1!lc":
                            valuesofstring[j] = ";";
                            break;
                        case "t#$11Z":
                            valuesofstring[j] = ",";
                            break;
                        case "S112@#":
                            valuesofstring[j] = "|";
                            break;
                        case "G#1!01":
                            valuesofstring[j] = "+";
                            break;
                        case "Ql!10e":
                            valuesofstring[j] = "~";
                            break;
                        case "DBb12@":
                            valuesofstring[j] = "/";
                            break;
                        case "Xkp1%s":
                            valuesofstring[j] = "<";
                            break;
                        case "xcQDft":
                            valuesofstring[j] = ">";
                            break;
                        case "gfw11@":
                            valuesofstring[j] = "?";
                            break;
                        case "1@w101":
                            valuesofstring[j] = "=";
                            break;


                    }

                    txtbox3.Text += valuesofstring[j];
                }
                //if (newint != 0)
                //{
                //    newint = newint / 143;
                //    txtbox3.Text += newint;
                //}
                //txtbox3.Text += newint / 143;
            }
        }
        public void Decryption3()
        {
            sd3 = txtbox1.Text.Length;
            if (sd3 == 0)
            {
                decryptString13 = txtbox2.Text.Trim();
                second33 = txtbox2.Text.Trim();
                int chunkSize = 7;
                int stringLength = second33.Length;
                for (int j = 0; j < stringLength; j += chunkSize)
                {
                    if (j + chunkSize > stringLength) chunkSize = stringLength - j;

                    //MessageBox.Show(second3.Substring(j, chunkSize));

                    if (second33.Substring(j, chunkSize).Contains("0111101"))
                    //if (second3.Contains("%100%"))
                    {

                        txtbox3.Text += 'a';

                        //second3.Remove(0, 5);
                    }
                    if (second33.Substring(j, chunkSize).Contains("0010101"))
                    //if (second3.Contains("+-00+"))
                    {
                        txtbox3.Text += 'b';

                        //  second3.Remove(6, 11);
                    }
                    if (second33.Substring(j, chunkSize).Contains("1000110"))
                    //if (second3.Contains("&*()-"))
                    {
                        txtbox3.Text += 'c';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1100011"))
                    //if (second3.Contains("^890+"))
                    {
                        txtbox3.Text += 'd';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0101011"))
                    //if (second3.Contains("$%001"))
                    {
                        txtbox3.Text += 'e';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0001011"))
                    //if (second3.Contains("@!11*"))
                    {

                        txtbox3.Text += 'f';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1010110"))
                    // if (second3.Contains("+-%#"))
                    {
                        txtbox3.Text += 'g';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1011010"))
                    //if (second3.Contains(";a41"))
                    {
                        txtbox3.Text += 'h';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1011111"))
                    //if (second3.Contains("111#"))
                    {
                        txtbox3.Text += 'i';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1101000"))
                    // if (second3.Contains("00&1"))
                    {
                        txtbox3.Text += 'j';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1101101"))
                    //  if (second3.Contains("@`!*"))
                    {
                        txtbox3.Text += 'k';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1110111"))
                    //  if (second3.Contains("*101$"))
                    {
                        txtbox3.Text += 'l';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1010001"))
                    //if (second3.Contains("$@+1"))
                    {
                        txtbox3.Text += 'm';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0111010"))
                    //if (second3.Contains("^1*&"))
                    {
                        txtbox3.Text += 'n';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1001010"))
                    // if (second3.Contains("/</1"))
                    {
                        txtbox3.Text += 'o';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1111101"))
                    //   if (second3.Contains("1~99"))
                    {
                        txtbox3.Text += 'p';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0101110"))
                    // if (second3.Contains("2&8#"))
                    {
                        txtbox3.Text += 'q';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0110000"))
                    // if (second3.Contains("(*@!"))
                    {
                        txtbox3.Text += 'r';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1011101"))
                    //if (second3.Contains("[^1^"))
                    {
                        txtbox3.Text += 's';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1011001"))
                    // if (second3.Contains("}\\7"))
                    {
                        txtbox3.Text += 't';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0010111"))
                    //if (second3.Contains("90+1"))
                    {
                        txtbox3.Text += 'u';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1010010"))
                    //if (second3.Contains("/j!@"))
                    {
                        txtbox3.Text += 'v';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1101001"))
                    //if (second3.Contains("]-*("))
                    {
                        txtbox3.Text += 'w';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1001110"))
                    //if (second3.Contains("!)-+"))
                    {
                        txtbox3.Text += 'x';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1111110"))
                    //if (second3.Contains("1111"))
                    {
                        txtbox3.Text += 'y';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1000001"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += 'z';
                    }


                    if (second33.Substring(j, chunkSize).Contains("1101110"))
                    {

                        txtbox3.Text += 'A';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0111100"))
                    {
                        txtbox3.Text += 'B';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0010100"))
                    {
                        txtbox3.Text += 'C';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1110001"))
                    {
                        txtbox3.Text += 'D';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1110100"))
                    {
                        txtbox3.Text += 'E';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1010100"))
                    {

                        txtbox3.Text += 'F';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0100100"))
                    {
                        txtbox3.Text += 'G';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0001111"))
                    //if (second3.Contains(";a41"))
                    {
                        txtbox3.Text += 'H';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0011001"))
                    //if (second3.Contains("111#"))
                    {
                        txtbox3.Text += 'I';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1111000"))
                    // if (second3.Contains("00&1"))
                    {
                        txtbox3.Text += 'J';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0100101"))
                    //  if (second3.Contains("@`!*"))
                    {
                        txtbox3.Text += 'K';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0101101"))
                    //  if (second3.Contains("*101$"))
                    {
                        txtbox3.Text += 'L';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0110111"))
                    //if (second3.Contains("$@+1"))
                    {
                        txtbox3.Text += 'M';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1101100"))
                    //if (second3.Contains("^1*&"))
                    {
                        txtbox3.Text += 'N';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0111111"))
                    // if (second3.Contains("/</1"))
                    {
                        txtbox3.Text += 'O';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0111110"))
                    //   if (second3.Contains("1~99"))
                    {
                        txtbox3.Text += 'P';

                    }
                    if (second33.Substring(j, chunkSize).Contains("1111100"))
                    // if (second3.Contains("2&8#"))
                    {
                        txtbox3.Text += 'Q';

                    }
                    if (second33.Substring(j, chunkSize).Contains("0101100"))
                    // if (second3.Contains("(*@!"))
                    {
                        txtbox3.Text += 'R';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0011100"))
                    //if (second3.Contains("[^1^"))
                    {
                        txtbox3.Text += 'S';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0110100"))
                    // if (second3.Contains("}\\7"))
                    {
                        txtbox3.Text += 'T';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0101001"))
                    //if (second3.Contains("90+1"))
                    {
                        txtbox3.Text += 'U';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1000100"))
                    //if (second3.Contains("/j!@"))
                    {
                        txtbox3.Text += 'V';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0101111"))
                    //if (second3.Contains("]-*("))
                    {
                        txtbox3.Text += 'W';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0000001"))
                    //if (second3.Contains("!)-+"))
                    {
                        txtbox3.Text += 'X';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0000110"))
                    //if (second3.Contains("1111"))
                    {
                        txtbox3.Text += 'Y';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0100010"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += 'Z';
                    }


                    if (second33.Substring(j, chunkSize).Contains("1000111"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '1';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1011011"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '2';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0001010"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '3';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1010101"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '4';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0100011"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '5';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0000010"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '6';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0010110"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '7';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0111001"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '8';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1000101"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '9';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0110010"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '0';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0110011"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '!';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0011101"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '#';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0111000"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '@';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1110101"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '$';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0110110"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '&';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0100111"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '*';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1101010"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '^';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0011000"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '-';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0100110"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '_';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0100000"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += ')';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1111001"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += ';';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0011111"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += ',';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0001100"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '|';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0101010"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '+';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1010111"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '~';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1100101"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '/';
                    }
                    if (second33.Substring(j, chunkSize).Contains("1110110"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '<';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0001110"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '>';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0110101"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '?';
                    }
                    if (second33.Substring(j, chunkSize).Contains("0011010"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '=';
                    }


                    //if (newint != 0)
                    //{
                    //    newint = newint / 143;
                    //    txtbox3.Text += newint;
                    //}
                }
            }

            else if (sd3 != 0)
            {
                two3 = new List<string>(txtbox2.Text.Length);
                two3 = valuesofstring.ToList();
                second23 = new string[valuesofstring.Length];
                second23 = two3.ToArray();
                // two.Capacity = txtbox2.Text.Length;
                for (int j = 0; j < valuesofstring.Length; j++)
                {
                    switch (second23[j])
                    {
                        case "0111101":
                            valuesofstring[j] = "a";
                            break;
                        case "0010101":
                            valuesofstring[j] = "b";
                            break;
                        case "1000110":
                            valuesofstring[j] = "c";
                            break;
                        case "1100011":
                            valuesofstring[j] = "d";
                            break;
                        case "0101011":
                            valuesofstring[j] = "e";
                            break;
                        case "0001011":
                            valuesofstring[j] = "f";
                            break;
                        case "1010110":
                            valuesofstring[j] = "g";
                            break;
                        case "1011010":
                            valuesofstring[j] = "h";
                            break;
                        case "1011111":
                            valuesofstring[j] = "i";
                            break;
                        case "1101000":
                            valuesofstring[j] = "j";
                            break;
                        case "1101101":
                            valuesofstring[j] = "k";
                            break;
                        case "1110111":
                            valuesofstring[j] = "l";
                            break;
                        case "1010001":
                            valuesofstring[j] = "m";
                            break;
                        case "0111010":
                            valuesofstring[j] = "n";
                            break;
                        case "1001010":
                            valuesofstring[j] = "o";
                            break;
                        case "1111101":
                            valuesofstring[j] = "p";
                            break;
                        case "0101110":
                            valuesofstring[j] = "q";
                            break;
                        case "0110000":
                            valuesofstring[j] = "r";
                            break;
                        case "1011101":
                            valuesofstring[j] = "s";
                            break;
                        case "1011001":
                            valuesofstring[j] = "t";
                            break;
                        case "0010111":
                            valuesofstring[j] = "u";
                            break;
                        case "1010010":
                            valuesofstring[j] = "v";
                            break;
                        case "1101001":
                            valuesofstring[j] = "w";
                            break;
                        case "1001110":
                            valuesofstring[j] = "x";
                            break;
                        case "1111110":
                            valuesofstring[j] = "y";
                            break;
                        case "1000001":
                            valuesofstring[j] = "z";
                            break;

                        case "1101110":
                            valuesofstring[j] = "A";
                            break;
                        case "0111100":
                            valuesofstring[j] = "B";
                            break;
                        case "0010100":
                            valuesofstring[j] = "C";
                            break;
                        case "1110001":
                            valuesofstring[j] = "D";
                            break;
                        case "1110100":
                            valuesofstring[j] = "E";
                            break;
                        case "1010100":
                            valuesofstring[j] = "F";
                            break;
                        case "0100100":
                            valuesofstring[j] = "G";
                            break;
                        case "0001111":
                            valuesofstring[j] = "H";
                            break;
                        case "0011001":
                            valuesofstring[j] = "I";
                            break;
                        case "1111000":
                            valuesofstring[j] = "J";
                            break;
                        case "0100101":
                            valuesofstring[j] = "K";
                            break;
                        case "0101101":
                            valuesofstring[j] = "L";
                            break;
                        case "0110111":
                            valuesofstring[j] = "M";
                            break;
                        case "1101100":
                            valuesofstring[j] = "N";
                            break;
                        case "0111111":
                            valuesofstring[j] = "O";
                            break;
                        case "0111110":
                            valuesofstring[j] = "P";
                            break;
                        case "1111100":
                            valuesofstring[j] = "Q";
                            break;
                        case "0101100":
                            valuesofstring[j] = "R";
                            break;
                        case "0011100":
                            valuesofstring[j] = "S";
                            break;
                        case "0110100":
                            valuesofstring[j] = "T";
                            break;
                        case "0101001":
                            valuesofstring[j] = "U";
                            break;
                        case "1000100":
                            valuesofstring[j] = "V";
                            break;
                        case "0101111":
                            valuesofstring[j] = "W";
                            break;
                        case "0000001":
                            valuesofstring[j] = "X";
                            break;
                        case "0000110":
                            valuesofstring[j] = "Y";
                            break;
                        case "0100010":
                            valuesofstring[j] = "Z";
                            break;


                        case "1000111":
                            valuesofstring[j] = "1";
                            break;
                        case "1011011":
                            valuesofstring[j] = "2";
                            break;
                        case "0001010":
                            valuesofstring[j] = "3";
                            break;
                        case "1010101":
                            valuesofstring[j] = "4";
                            break;
                        case "0100011":
                            valuesofstring[j] = "5";
                            break;
                        case "0000010":
                            valuesofstring[j] = "6";
                            break;
                        case "0010110":
                            valuesofstring[j] = "7";
                            break;
                        case "0111001":
                            valuesofstring[j] = "8";
                            break;
                        case "1000101":
                            valuesofstring[j] = "9";
                            break;
                        case "0110010":
                            valuesofstring[j] = "0";
                            break;
                        case "0110011":
                            valuesofstring[j] = "!";
                            break;
                        case "0011101":
                            valuesofstring[j] = "#";
                            break;
                        case "0111000":
                            valuesofstring[j] = "@";
                            break;
                        case "1110101":
                            valuesofstring[j] = "$";
                            break;
                        case "0110110":
                            valuesofstring[j] = "&";
                            break;
                        case "0100111":
                            valuesofstring[j] = "*";
                            break;
                        case "1101010":
                            valuesofstring[j] = "^";
                            break;
                        case "0011000":
                            valuesofstring[j] = "-";
                            break;
                        case "0100110":
                            valuesofstring[j] = "_";
                            break;
                        case "0100000":
                            valuesofstring[j] = ")";
                            break;
                        case "1111001":
                            valuesofstring[j] = ";";
                            break;
                        case "0011111":
                            valuesofstring[j] = ",";
                            break;
                        case "0001100":
                            valuesofstring[j] = "|";
                            break;
                        case "0101010":
                            valuesofstring[j] = "+";
                            break;
                        case "1010111":
                            valuesofstring[j] = "~";
                            break;
                        case "1100101":
                            valuesofstring[j] = "/";
                            break;
                        case "1110110":
                            valuesofstring[j] = "<";
                            break;
                        case "0001110":
                            valuesofstring[j] = ">";
                            break;
                        case "0110101":
                            valuesofstring[j] = "?";
                            break;
                        case "0011010":
                            valuesofstring[j] = "=";
                            break;
                    }
                    txtbox3.Text += valuesofstring[j];
                }

                //if (newint != 0)
                //{
                //    newint = newint / 143;
                //    txtbox3.Text += newint;
                //}
                //txtbox3.Text += newint / 143;
            }
        }

        public void Decryption4()
        {

            sd4 = txtbox1.Text.Length;
            if (sd4 == 0)
            {
                //encrypt();
                //int arrc=0;
                decryptString134 = txtbox2.Text.Trim();
                second334 = txtbox2.Text.Trim();
                //for (int i = 0; i < second3.Length; i++)
                //{


                //string str = "111122223333444455";
                int chunkSize = 10;
                int stringLength = second334.Length;
                for (int j = 0; j < stringLength; j += chunkSize)
                {
                    if (j + chunkSize > stringLength) chunkSize = stringLength - j;

                    //MessageBox.Show(second3.Substring(j, chunkSize));

                    if (second334.Substring(j, chunkSize).Contains("w109oXV010"))
                    //if (second3.Contains("%100%"))
                    {

                        txtbox3.Text += 'a';

                        //second3.Remove(0, 5);
                    }
                    if (second334.Substring(j, chunkSize).Contains("Ha3#101rYt"))
                    //if (second3.Contains("+-00+"))
                    {
                        txtbox3.Text += 'b';

                        //  second3.Remove(6, 11);
                    }
                    if (second334.Substring(j, chunkSize).Contains("00VHA80wTo"))
                    //if (second3.Contains("&*()-"))
                    {
                        txtbox3.Text += 'c';

                    }
                    if (second334.Substring(j, chunkSize).Contains("1A#6df00ew"))
                    //if (second3.Contains("^890+"))
                    {
                        txtbox3.Text += 'd';

                    }
                    if (second334.Substring(j, chunkSize).Contains("11QudkF0lo"))
                    //if (second3.Contains("$%001"))
                    {
                        txtbox3.Text += 'e';

                    }
                    if (second334.Substring(j, chunkSize).Contains("0H4jpqP$li"))
                    //if (second3.Contains("@!11*"))
                    {

                        txtbox3.Text += 'f';
                    }
                    if (second334.Substring(j, chunkSize).Contains("0110A0o@9#"))
                    // if (second3.Contains("+-%#"))
                    {
                        txtbox3.Text += 'g';

                    }
                    if (second334.Substring(j, chunkSize).Contains("#1Vgk46u8F"))
                    //if (second3.Contains(";a41"))
                    {
                        txtbox3.Text += 'h';

                    }
                    if (second334.Substring(j, chunkSize).Contains("3zA*rlw1d@"))
                    //if (second3.Contains("111#"))
                    {
                        txtbox3.Text += 'i';

                    }
                    if (second334.Substring(j, chunkSize).Contains("1@hsQ%2kp0"))
                    // if (second3.Contains("00&1"))
                    {
                        txtbox3.Text += 'j';

                    }
                    if (second334.Substring(j, chunkSize).Contains("3$Fk010D11"))
                    //  if (second3.Contains("@`!*"))
                    {
                        txtbox3.Text += 'k';

                    }
                    if (second334.Substring(j, chunkSize).Contains("Coe!O1$h&0"))
                    //  if (second3.Contains("*101$"))
                    {
                        txtbox3.Text += 'l';

                    }
                    if (second334.Substring(j, chunkSize).Contains("10Ep$Dx!8u"))
                    //if (second3.Contains("$@+1"))
                    {
                        txtbox3.Text += 'm';

                    }
                    if (second334.Substring(j, chunkSize).Contains("T!x%ui#11A"))
                    //if (second3.Contains("^1*&"))
                    {
                        txtbox3.Text += 'n';

                    }
                    if (second334.Substring(j, chunkSize).Contains("Aj#4TqlZ3@"))
                    // if (second3.Contains("/</1"))
                    {
                        txtbox3.Text += 'o';

                    }
                    if (second334.Substring(j, chunkSize).Contains("00O$CkXHq8"))
                    //   if (second3.Contains("1~99"))
                    {
                        txtbox3.Text += 'p';

                    }
                    if (second334.Substring(j, chunkSize).Contains("4$D11Ysw0a"))
                    // if (second3.Contains("2&8#"))
                    {
                        txtbox3.Text += 'q';

                    }
                    if (second334.Substring(j, chunkSize).Contains("11#vIlq5!M"))
                    // if (second3.Contains("(*@!"))
                    {
                        txtbox3.Text += 'r';
                    }
                    if (second334.Substring(j, chunkSize).Contains("N010e8D#z&"))
                    //if (second3.Contains("[^1^"))
                    {
                        txtbox3.Text += 's';
                    }
                    if (second334.Substring(j, chunkSize).Contains("j8o2Fz$ai@"))
                    // if (second3.Contains("}\\7"))
                    {
                        txtbox3.Text += 't';
                    }
                    if (second334.Substring(j, chunkSize).Contains("1101Dm#pew"))
                    //if (second3.Contains("90+1"))
                    {
                        txtbox3.Text += 'u';
                    }
                    if (second334.Substring(j, chunkSize).Contains("F4#hs01#qL"))
                    //if (second3.Contains("/j!@"))
                    {
                        txtbox3.Text += 'v';
                    }
                    if (second334.Substring(j, chunkSize).Contains("F@hCp11s0z"))
                    //if (second3.Contains("]-*("))
                    {
                        txtbox3.Text += 'w';
                    }
                    if (second334.Substring(j, chunkSize).Contains("10Uxfb6wNe"))
                    //if (second3.Contains("!)-+"))
                    {
                        txtbox3.Text += 'x';
                    }
                    if (second334.Substring(j, chunkSize).Contains("nB&c10$1#e"))
                    //if (second3.Contains("1111"))
                    {
                        txtbox3.Text += 'y';
                    }
                    if (second334.Substring(j, chunkSize).Contains("m*a10uGs#i"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += 'z';
                    }



                    if (second334.Substring(j, chunkSize).Contains("10UxfnB&c1"))
                    //if (second3.Contains("%100%"))
                    {

                        txtbox3.Text += 'A';

                        //second3.Remove(0, 5);
                    }
                    if (second334.Substring(j, chunkSize).Contains("m*a100$1#e"))
                    //if (second3.Contains("+-00+"))
                    {
                        txtbox3.Text += 'B';

                        //  second3.Remove(6, 11);
                    }
                    if (second334.Substring(j, chunkSize).Contains("b6wNeuGs#i"))
                    //if (second3.Contains("&*()-"))
                    {
                        txtbox3.Text += 'C';

                    }
                    if (second334.Substring(j, chunkSize).Contains("jpBs1l10%s"))
                    //if (second3.Contains("^890+"))
                    {
                        txtbox3.Text += 'D';

                    }
                    if (second334.Substring(j, chunkSize).Contains("Pc11xyNlxt"))
                    //if (second3.Contains("$%001"))
                    {
                        txtbox3.Text += 'E';

                    }
                    if (second334.Substring(j, chunkSize).Contains("02WnyaFa8%"))
                    //if (second3.Contains("@!11*"))
                    {

                        txtbox3.Text += 'F';
                    }
                    if (second334.Substring(j, chunkSize).Contains("M4lex08oEq"))
                    // if (second3.Contains("+-%#"))
                    {
                        txtbox3.Text += 'G';

                    }
                    if (second334.Substring(j, chunkSize).Contains("8Hdi1pctdZ"))
                    //if (second3.Contains(";a41"))
                    {
                        txtbox3.Text += 'H';

                    }
                    if (second334.Substring(j, chunkSize).Contains("10X!dPabiE"))
                    //if (second3.Contains("111#"))
                    {
                        txtbox3.Text += 'I';

                    }
                    if (second334.Substring(j, chunkSize).Contains("SpnfOpt%Zw"))
                    // if (second3.Contains("00&1"))
                    {
                        txtbox3.Text += 'J';

                    }
                    if (second334.Substring(j, chunkSize).Contains("011100#Sic"))
                    //  if (second3.Contains("@`!*"))
                    {
                        txtbox3.Text += 'K';

                    }
                    if (second334.Substring(j, chunkSize).Contains("%Dvyx01D1#"))
                    //  if (second3.Contains("*101$"))
                    {
                        txtbox3.Text += 'L';

                    }
                    if (second334.Substring(j, chunkSize).Contains("F4ciXlksd0"))
                    //if (second3.Contains("$@+1"))
                    {
                        txtbox3.Text += 'M';

                    }
                    if (second334.Substring(j, chunkSize).Contains("tpk1X1@Rdm"))
                    //if (second3.Contains("^1*&"))
                    {
                        txtbox3.Text += 'N';

                    }
                    if (second334.Substring(j, chunkSize).Contains("vSlocs8Dwc"))
                    // if (second3.Contains("/</1"))
                    {
                        txtbox3.Text += 'O';

                    }
                    if (second334.Substring(j, chunkSize).Contains("GScq0#11np"))
                    //   if (second3.Contains("1~99"))
                    {
                        txtbox3.Text += 'P';

                    }
                    if (second334.Substring(j, chunkSize).Contains("dEqdcjE#01"))
                    // if (second3.Contains("2&8#"))
                    {
                        txtbox3.Text += 'Q';

                    }
                    if (second334.Substring(j, chunkSize).Contains("kdKx1100#s"))
                    // if (second3.Contains("(*@!"))
                    {
                        txtbox3.Text += 'R';
                    }
                    if (second334.Substring(j, chunkSize).Contains("Fxd11calLe"))
                    //if (second3.Contains("[^1^"))
                    {
                        txtbox3.Text += 'S';
                    }
                    if (second334.Substring(j, chunkSize).Contains("11kXdgJbTp"))
                    // if (second3.Contains("}\\7"))
                    {
                        txtbox3.Text += 'T';
                    }
                    if (second334.Substring(j, chunkSize).Contains("dcVs@1oSz!"))
                    //if (second3.Contains("90+1"))
                    {
                        txtbox3.Text += 'U';
                    }
                    if (second334.Substring(j, chunkSize).Contains("#F1eJ#svJp"))
                    //if (second3.Contains("/j!@"))
                    {
                        txtbox3.Text += 'V';
                    }
                    if (second334.Substring(j, chunkSize).Contains("Ude10%hcQ!"))
                    //if (second3.Contains("]-*("))
                    {
                        txtbox3.Text += 'W';
                    }
                    if (second334.Substring(j, chunkSize).Contains("cv01k0o18W"))
                    //if (second3.Contains("!)-+"))
                    {
                        txtbox3.Text += 'X';
                    }
                    if (second334.Substring(j, chunkSize).Contains("ho!eTDt0j@"))
                    //if (second3.Contains("1111"))
                    {
                        txtbox3.Text += 'Y';
                    }
                    if (second334.Substring(j, chunkSize).Contains("2vGmd01%Hz"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += 'Z';
                    }



                    if (second334.Substring(j, chunkSize).Contains("jpBs101%Hz"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '1';
                    }
                    if (second334.Substring(j, chunkSize).Contains("Pc11xDt0j@"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '2';
                    }
                    if (second334.Substring(j, chunkSize).Contains("01Eqk0o18W"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '3';
                    }
                    if (second334.Substring(j, chunkSize).Contains("02Fny%hcQ!"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '4';
                    }
                    if (second334.Substring(j, chunkSize).Contains("M4lex#svJp"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '5';
                    }
                    if (second334.Substring(j, chunkSize).Contains("8Hdi11oSz!"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '6';
                    }
                    if (second334.Substring(j, chunkSize).Contains("10X!dgJbTp"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '7';
                    }
                    if (second334.Substring(j, chunkSize).Contains("SpnfOcalLe"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '8';
                    }
                    if (second334.Substring(j, chunkSize).Contains("01110100#s"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '9';
                    }
                    if (second334.Substring(j, chunkSize).Contains("%DvyxjE#01"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '0';
                    }
                    if (second334.Substring(j, chunkSize).Contains("F4ciM#11np"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '!';
                    }
                    if (second334.Substring(j, chunkSize).Contains("tpk1Xs8Dwc"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '#';
                    }
                    if (second334.Substring(j, chunkSize).Contains("vSloc!pGdW"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '@';
                    }
                    if (second334.Substring(j, chunkSize).Contains("GScq01@Rdm"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '$';
                    }
                    if (second334.Substring(j, chunkSize).Contains("dEqdclksd0"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '&';
                    }
                    if (second334.Substring(j, chunkSize).Contains("kdKx101D1#"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '*';
                    }
                    if (second334.Substring(j, chunkSize).Contains("Fxd110#Sic"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '^';
                    }
                    if (second334.Substring(j, chunkSize).Contains("11kXdpt%Zw"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '-';
                    }
                    if (second334.Substring(j, chunkSize).Contains("dcVs@PabiE"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '_';
                    }
                    if (second334.Substring(j, chunkSize).Contains("#F1eJpctdZ"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += ')';
                    }
                    if (second334.Substring(j, chunkSize).Contains("Ude1008oEq"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += ';';
                    }
                    if (second334.Substring(j, chunkSize).Contains("cv01kaFa8%"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += ',';
                    }
                    if (second334.Substring(j, chunkSize).Contains("f!8DzAdYl1"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '|';
                    }
                    if (second334.Substring(j, chunkSize).Contains("ho!eTyNlxt"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '+';
                    }
                    if (second334.Substring(j, chunkSize).Contains("2vGmdl10%s"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '~';
                    }
                    if (second334.Substring(j, chunkSize).Contains("nDxc10%hqm"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '/';
                    }
                    if (second334.Substring(j, chunkSize).Contains("sX!jw1f10N"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '<';
                    }
                    if (second334.Substring(j, chunkSize).Contains("Lpzu110$i#"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '>';
                    }
                    if (second334.Substring(j, chunkSize).Contains("@Epd%81Tfs"))
                    //if (second3.Contains("1+&*"))
                    {
                        txtbox3.Text += '?';
                    }
                    if (second334.Substring(j, chunkSize).Contains("Hb8%6!fLox"))
                    {
                        txtbox3.Text += '=';
                    }
                }
            }

            else if (sd4 != 0)
            {
                two34 = new List<string>(txtbox2.Text.Length);
                two34 = valuesofstring.ToList();
                second234 = new string[valuesofstring.Length];
                second234 = two34.ToArray();
                for (int j = 0; j < valuesofstring.Length; j++)
                {
                    switch (second234[j])
                    {
                        case "w109oXV010":
                            valuesofstring[j] = "a";
                            break;
                        case "Ha3#101rYt":
                            valuesofstring[j] = "b";
                            break;
                        case "00VHA80wTo":
                            valuesofstring[j] = "c";
                            break;
                        case "1A#6df00ew":
                            valuesofstring[j] = "d";
                            break;
                        case "11QudkF0lo":
                            valuesofstring[j] = "e";
                            break;
                        case "0H4jpqP$li":
                            valuesofstring[j] = "f";
                            break;
                        case "0110A0o@9#":
                            valuesofstring[j] = "g";
                            break;
                        case "#1Vgk46u8F":
                            valuesofstring[j] = "h";
                            break;
                        case "3zA*rlw1d@":
                            valuesofstring[j] = "i";
                            break;
                        case "1@hsQ%2kp0":
                            valuesofstring[j] = "j";
                            break;
                        case "3$Fk010D11":
                            valuesofstring[j] = "k";
                            break;
                        case "Coe!O1$h&0":
                            valuesofstring[j] = "l";
                            break;
                        case "10Ep$Dx!8u":
                            valuesofstring[j] = "m";
                            break;
                        case "T!x%ui#11A":
                            valuesofstring[j] = "n";
                            break;
                        case "Aj#4TqlZ3@":
                            valuesofstring[j] = "o";
                            break;
                        case "00O$CkXHq8":
                            valuesofstring[j] = "p";
                            break;
                        case "4$D11Ysw0a":
                            valuesofstring[j] = "q";
                            break;
                        case "11#vIlq5!M":
                            valuesofstring[j] = "r";
                            break;
                        case "N010e8D#z&":
                            valuesofstring[j] = "s";
                            break;
                        case "j8o2Fz$ai@":
                            valuesofstring[j] = "t";
                            break;
                        case "1101Dm#pew":
                            valuesofstring[j] = "u";
                            break;
                        case "F4#hs01#qL":
                            valuesofstring[j] = "v";
                            break;
                        case "F@hCp11s0z":
                            valuesofstring[j] = "w";
                            break;
                        case "10Uxfb6wNe":
                            valuesofstring[j] = "x";
                            break;
                        case "nB&c10$1#e":
                            valuesofstring[j] = "y";
                            break;
                        case "m*a10uGs#i":
                            valuesofstring[j] = "z";
                            break;



                        case "10UxfnB&c1":
                            valuesofstring[j] = "A";
                            break;
                        case "m*a100$1#e":
                            valuesofstring[j] = "B";
                            break;
                        case "b6wNeuGs#i":
                            valuesofstring[j] = "C";
                            break;
                        case "jpBs1l10%s":
                            valuesofstring[j] = "D";
                            break;
                        case "Pc11xyNlxt":
                            valuesofstring[j] = "E";
                            break;
                        case "02WnyaFa8%":
                            valuesofstring[j] = "F";
                            break;
                        case "M4lex08oEq":
                            valuesofstring[j] = "G";
                            break;
                        case "8Hdi1pctdZ":
                            valuesofstring[j] = "H";
                            break;
                        case "10X!dPabiE":
                            valuesofstring[j] = "I";
                            break;
                        case "SpnfOpt%Zw":
                            valuesofstring[j] = "J";
                            break;
                        case "011100#Sic":
                            valuesofstring[j] = "K";
                            break;
                        case "%Dvyx01D1#":
                            valuesofstring[j] = "L";
                            break;
                        case "F4ciXlksd0":
                            valuesofstring[j] = "M";
                            break;
                        case "tpk1X1@Rdm":
                            valuesofstring[j] = "N";
                            break;
                        case "vSlocs8Dwc":
                            valuesofstring[j] = "O";
                            break;
                        case "GScq0#11np":
                            valuesofstring[j] = "P";
                            break;
                        case "dEqdcjE#01":
                            valuesofstring[j] = "Q";
                            break;
                        case "kdKx1100#s":
                            valuesofstring[j] = "R";
                            break;
                        case "Fxd11calLe":
                            valuesofstring[j] = "S";
                            break;
                        case "11kXdgJbTp":
                            valuesofstring[j] = "T";
                            break;
                        case "dcVs@1oSz!":
                            valuesofstring[j] = "U";
                            break;
                        case "#F1eJ#svJp":
                            valuesofstring[j] = "V";
                            break;
                        case "Ude10%hcQ!":
                            valuesofstring[j] = "W";
                            break;
                        case "cv01k0o18W":
                            valuesofstring[j] = "X";
                            break;
                        case "ho!eTDt0j@":
                            valuesofstring[j] = "Y";
                            break;
                        case "2vGmd01%Hz":
                            valuesofstring[j] = "Z";
                            break;


                        case "jpBs101%Hz":
                            valuesofstring[j] = "1";
                            break;
                        case "Pc11xDt0j@":
                            valuesofstring[j] = "2";
                            break;
                        case "01Eqk0o18W":
                            valuesofstring[j] = "3";
                            break;
                        case "02Fny%hcQ!":
                            valuesofstring[j] = "4";
                            break;
                        case "M4lex#svJp":
                            valuesofstring[j] = "5";
                            break;
                        case "8Hdi11oSz!":
                            valuesofstring[j] = "6";
                            break;
                        case "10X!dgJbTp":
                            valuesofstring[j] = "7";
                            break;
                        case "SpnfOcalLe":
                            valuesofstring[j] = "8";
                            break;
                        case "01110100#s":
                            valuesofstring[j] = "9";
                            break;
                        case "%DvyxjE#01":
                            valuesofstring[j] = "0";
                            break;
                        case "F4ciM#11np":
                            valuesofstring[j] = "!";
                            break;
                        case "tpk1Xs8Dwc":
                            valuesofstring[j] = "#";
                            break;
                        case "vSloc!pGdW":
                            valuesofstring[j] = "@";
                            break;
                        case "GScq01@Rdm":
                            valuesofstring[j] = "$";
                            break;
                        case "dEqdclksd0":
                            valuesofstring[j] = "&";
                            break;
                        case "kdKx101D1#":
                            valuesofstring[j] = "*";
                            break;
                        case "Fxd110#Sic":
                            valuesofstring[j] = "^";
                            break;
                        case "11kXdpt%Zw":
                            valuesofstring[j] = "-";
                            break;
                        case "dcVs@PabiE":
                            valuesofstring[j] = "_";
                            break;
                        case "#F1eJpctdZ":
                            valuesofstring[j] = ")";
                            break;
                        case "Ude1008oEq":
                            valuesofstring[j] = ";";
                            break;
                        case "cv01kaFa8%":
                            valuesofstring[j] = ",";
                            break;
                        case "f!8DzAdYl1":
                            valuesofstring[j] = "|";
                            break;
                        case "ho!eTyNlxt":
                            valuesofstring[j] = "+";
                            break;
                        case "2vGmdl10%s":
                            valuesofstring[j] = "~";
                            break;
                        case "nDxc10%hqm":
                            valuesofstring[j] = "/";
                            break;
                        case "sX!jw1f10N":
                            valuesofstring[j] = "<";
                            break;
                        case "Lpzu110$i#":
                            valuesofstring[j] = ">";
                            break;
                        case "@Epd%81Tfs":
                            valuesofstring[j] = "?";
                            break;
                        case "Hb8%6!fLox":
                            valuesofstring[j] = "=";
                            break;
                    }
                    txtbox3.Text += valuesofstring[j];
                }
            }
        }
        public void function1()
        {
            t1 = txtbox3.Text.Length;
            int adf = txtbox2.Text.Length;
            //int aafg = adf % 7;
            if (adf % 7 == 0 && t1 == 0)
            {
                Decryption3();
                Debug.WriteLine("t1 for dec 3");

            }
            if (adf % 6 == 0 && t1 == 0)
            {
                Decryption2();
                Debug.WriteLine("t1 for dec 2");
            }
            if (adf % 7 == 0 && t1 == 0)
            {
                Decryption1();
                Debug.WriteLine("t1 for dec 1");
            }
            if (adf % 10 == 0 && t1 == 0)
            {
                Decryption4();
                Debug.WriteLine("t1 for dec 4");
            }
        }


        private void btnEncrypt_Click(object sender, RoutedEventArgs e)
        {

            Random rnd = new Random();
            int randFn = rnd.Next(0, 4);

            selectedFn = randFn;
            if (randFn == 0)
            {
                encrypt();
                Encryption1();
                MessageBox.Show("first click");
            }
            else if (randFn == 1)
            {
                encrypt();
                Encryption2();
                MessageBox.Show("second click");
            }
            else if (randFn == 2)
            {
                encrypt();
                Encryption3();
                MessageBox.Show("third click");
            }
            else if (randFn == 3)
            {
                encrypt();
                Encryption4();
                MessageBox.Show("fourth click");
            }
        }
        private void btnDecrypt_Click(object sender, RoutedEventArgs e)
        {
            if (selectedFn == 0)
            {
                Decryption1();
                MessageBox.Show("first decryption");
                az = 1;
            }
            else if (selectedFn == 1)
            {
                Decryption2();
                MessageBox.Show("second decryption");
                az = 1;
            }
            else if (selectedFn == 2)
            {
                Decryption3();
                MessageBox.Show("third decryption");
                az = 1;
            }
            else if (selectedFn == 3)
            {
                Decryption4();
                MessageBox.Show("fourth decryption");
                az = 1;
            }
            if (az == 0)
            {
                function1();
                az = 1;
            }

            if (txtbox1.Text.Length == 0 && txtbox3.Text.Length == 0)
            {
                function1();
            }


        }
        public void ClearAll()
        {
            txtbox1.Text = null;
            txtbox2.Text = null;
            txtbox3.Text = null;
            sizeofstring = 0;
            valuesofstring = null; newint = 0;
            two = null;
            mainString = null;
            sd = 0; dp = null;
            CopyOfIntegers.Clear();
            count = 0; count2 = 0; newint = 0;
            d1.Clear();
            CopyOfIntegers.Clear();
            second2 = null;
            txtbox2.Text = null;
            copyofString.Clear();
            integerString = null;
            txtbox3.Text = null; ssr = null; valuesofstring = null;
            second3 = null; count2 = 0;
            decryptStringArr = null;
            decryptString1 = null;
            second3 = null;

            second22 = null;
            sd2 = 0;
            two2 = null;
            second32 = null;
            decryptString12 = null;

            second33 = null;
            sd3 = 0;
            two3 = null;
            second23 = null;
            decryptString13 = null;

            second334 = null;
            sd4 = 0;
            two34 = null;
            second234 = null;
            decryptString134 = null;

            az = 0;
        }
        private void Clearbtn_Click(object sender, RoutedEventArgs e)
        {
            txtbox1.Clear();
            //txtbox1.ClearValue();
            ClearAll();
            txtbox2.Clear();
            txtbox3.Clear();
        }
        private void Button_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

    }
}
