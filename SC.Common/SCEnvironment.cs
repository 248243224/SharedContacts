using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Diagnostics;

namespace SC.Common
{
    public class SCEnvironment
    {

        public static string AttchmentRootFolder { get => Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), @"SharedContacts"); }
        public static string RedPacketImgFolder { get => Path.Combine(AttchmentRootFolder, @"RedPacketImg"); }
        public static string AvatarImgFolder { get => Path.Combine(AttchmentRootFolder, @"AvatarImg"); }
        public static string DateTimeFormat { get => "yyyy.MM.dd HH.mm"; }
        public static double CityAgencyPrice { get => 300; }
        public static double CountryAgencyPrice { get => 1000; }
        public static double AgencyProfitPercent { get => 0.1; }

        public static bool Init()
        {
            try
            {
                if (!Directory.Exists(RedPacketImgFolder))
                    Directory.CreateDirectory(RedPacketImgFolder);
                if (!Directory.Exists(AvatarImgFolder))
                    Directory.CreateDirectory(AvatarImgFolder);

                return true;
            }
            catch (Exception ex)
            {
                Trace.TraceError($"SCEnvironment::Init: {ex.Message}");
                return false;
            }
        }
    }
}
