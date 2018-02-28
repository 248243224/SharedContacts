using Microsoft.Owin.Hosting;
using SC.Common;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading;

namespace SC.ImAndDataApi.Hoster
{
    public class Entry
    {
        private ManualResetEventSlim _stopEvent;

        public Entry()
        {
            _stopEvent = new ManualResetEventSlim(false);
        }

        static void LogConfig()
        {

            var docs = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            var logFile = System.IO.Path.Combine(docs, "SharedContacts.log");

            Trace.AutoFlush = true;
#if DEBUG
            //log console
            Trace.Listeners.Add(new TextWriterTraceListener(Console.Out));
#endif
            Trace.Listeners.Add(new TextWriterTraceListener(logFile, "myListener"));
            Trace.WriteLine("");
            Trace.WriteLine("");
            Trace.WriteLine("");
            Trace.Indent();
            Trace.WriteLine("********** Shared Contacts ************");
        }

        public void ApiStart()
        {
            LogConfig();
            if (SCEnvironment.Init())
            {
                //AddLocalhostCertificateToTrustedRootIfNotAlreadyAdded();
                //using (WebApp.Start("http://192.168.48.1:8084"))
                using (WebApp.Start("http://172.17.0.15"))
                {
                    Trace.TraceInformation("web api has been hosted");
                    //this must be blocked, else webapp will stop
                    while (!_stopEvent.Wait(TimeSpan.FromHours(1)))
                    {
                        System.Diagnostics.Trace.TraceInformation("Im and data api still running " + System.DateTime.Now);
                    }
                }
            }
        }

        public void ApiStop()
        {
            _stopEvent.Set();
        }

        private static void AddLocalhostCertificateToTrustedRootIfNotAlreadyAdded()
        {
            Trace.TraceInformation("Checking for localhost certificate...");
            var localhostCert = new X509Certificate2("localhost.pfx", "Six7ate9!", X509KeyStorageFlags.MachineKeySet);
            if (localhostCert != null)
            {
                var store = new X509Store(StoreName.Root, StoreLocation.LocalMachine);
                store.Open(OpenFlags.ReadWrite);
                if (!store.Certificates.Contains(localhostCert))
                {
                    store.Add(localhostCert);
                    Trace.TraceInformation("Added localhost certificate to local machine/trusted root");
                }
                else
                {
                    Trace.TraceInformation("Localhost certificate already added to local machine/trusted root");
                }
                store.Close();
            }
            else
            {
                throw new Exception("Could not load locahost.pfx.");
            }

            //
            // Also bind the local port to this cert for everyone
            //

            //
            // Check to see if the URL ACL is registered already
            //
            ProcessStartInfo psi = new ProcessStartInfo("netsh", "http show urlacl url=https://localhost:8089/");
            psi.CreateNoWindow = false;
            psi.ErrorDialog = true;
            psi.WindowStyle = ProcessWindowStyle.Normal;
            psi.UseShellExecute = false;
            psi.RedirectStandardOutput = true;
            psi.RedirectStandardError = true;
            var p1 = Process.Start(psi);
            if (!p1.WaitForExit(5000))
            {
                throw new Exception("Error issuing urlacl command.  Are you in Administrative mode??");
            }
            var output = p1.StandardOutput.ReadToEnd();
            var exists = output.Contains("https://localhost:8089/");

            if (!exists)
            {

                psi = new ProcessStartInfo("netsh", "http add urlacl url=https://localhost:8089/ user=Everyone");
                psi.CreateNoWindow = false;
                psi.ErrorDialog = true;
                psi.WindowStyle = ProcessWindowStyle.Normal;
                psi.UseShellExecute = false;
                psi.RedirectStandardOutput = true;
                psi.RedirectStandardError = true;
                p1 = Process.Start(psi);
                if (!p1.WaitForExit(5000))
                {
                    throw new Exception("Error issuing urlacl command.  Are you in Administrative mode??");
                }
                Trace.TraceInformation("Issued urlacl command.");
                Trace.TraceInformation(p1.StandardOutput.ReadToEnd());
            }


            //
            // Now check to see if the sslcert is already bound
            //
            psi = new ProcessStartInfo("netsh", "http show sslcert ipport=0.0.0.0:8089");
            psi.CreateNoWindow = false;
            psi.ErrorDialog = true;
            psi.WindowStyle = ProcessWindowStyle.Normal;
            psi.UseShellExecute = false;
            psi.RedirectStandardOutput = true;
            psi.RedirectStandardError = true;
            p1 = Process.Start(psi);
            if (!p1.WaitForExit(5000))
            {
                throw new Exception("Error issuing urlacl command.  Are you in Administrative mode??");
            }
            output = p1.StandardOutput.ReadToEnd();
            exists = output.Contains("0.0.0.0:8089");

            if (!exists)
            {
                psi = new ProcessStartInfo("netsh", "http add sslcert ipport=0.0.0.0:8089 certhash=8d74c0be39e1b31faa50e5f12d18f6ff06e63fea appid={623C12E4-4BF1-4FA8-B434-65210EFECE2A} CertStoreName=Root");
                psi.CreateNoWindow = false;
                psi.ErrorDialog = true;
                psi.WindowStyle = ProcessWindowStyle.Normal;
                psi.UseShellExecute = false;
                psi.RedirectStandardOutput = true;
                psi.RedirectStandardError = true;
                p1 = Process.Start(psi);
                if (!p1.WaitForExit(5000))
                {
                    throw new Exception("Error issuing add sslcert command.  Are you in Administrative mode??");
                }
                Trace.TraceInformation("Issued urlacl command.");
                Trace.TraceInformation(p1.StandardOutput.ReadToEnd());
            }

        }
    }

    public class Program
    {
        static void Main(string[] args)
        {
            Entry api = new Entry();
            api.ApiStart();
            Trace.TraceInformation("press any key to stop api...");
            Console.ReadKey();
            api.ApiStop();
        }
    }
}
