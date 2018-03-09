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
        public static string AlipayServerUrl { get => "http://sc.handsave.com"; }
        public static string AlipayAppId { get => "2018020902171382"; }
        public static string AlipayPrivateKey { get => "MIIEpQIBAAKCAQEA0+vU+NpnwlJ7GpyzinZGyrQAULvfuoI/DVUOkOuUDEeoV1YooDpeSq8NsaByDI+SL0nDpZCSl/zSp0fO9/PjDqjQYTZi4R/L9lIjCrRUAnAD+8MydOxesDVPHS9h6+T7SDD9gYjVMKJcr2n2h6Uqc/uTLW1qOup/Mf229hawPOMwCSWmAan1fIztsxgt3L2l15pF6znsK46TD0uMGxUn9TrasoqOyas5LSBWOAYXSvIiVNy21f5LMv8jnddQ9ykujaNiPGZS2nvBHgph6DueznjqA6pIFp3/60V32DlJddUDMOkdUnsoDrvQwux1tEX4QkUl9nopkXKvmFvFKlR7jwIDAQABAoIBAQCaB6VKIuSblvunAhJ1JzaZCm/YPlWE6DoP5KyrpK58pnCy2gq5OvNh8Q5Q9r8uZgPonwK3CfeixL4Pm9/Q1NFJzGV44uDHpCbJKDYUB7Gv+97JVL0Nwuenx3dzTQctP8dsVz9KsTvTF4+qZ6gqO2A54La+o/I8VEiS+0fKYf9CoMOjrjzhujW1WnoJPsgP+/AZpF2DrsA+P/ECFMadYx8biZJQe3qnUgbapsq1fjGuMi+5v8UlODGVsRIiHTN0pXqjAhO22LZp8+enrLTGuASPWRF2J88o9ADH/PCvry1PTCrfUyceEZI0P9DoUTfvQ17655uydBsUGi/xRKI7P/whAoGBAOtORFuyXoiav86wJgo1HOVqOBO9t6cSEwNCBa4kpfLerkqOiysvgj9kBN9hExPN6G2LLwXx4xfvyyNcfD8nCjrrDG8Dt7X4+lPvdHm5nI15kCThiW3mAvQGCW9FxPomEsn8o48b2Br+5s1WRWCE9SrIG6JnbFb/xXvvGbM9P0PnAoGBAOaPFH5jE7UdegQb9BloQQji0g+9Ka4edVIdiLhBbdFx3aFGDOTcYPFgYqUh58Omdr2c3sOvYIZJFwCMxYw62Ye6IBPApl9iaYCNojuzt6HW7/efr9sOcLWFAOmUmBNtrMduxr2pe3Zd+XdsQRkzxPCy7ui++7EuxYwVEE58BxYZAoGBALJauc+zTJpIibhVpg+4oHV35Jd6Btl5BrZCdeHAX5TOmtdiYjRSp2v7GQJkJzysp09Y30SnStWa6aOc94Q6yDNOdDc1XytsU/oJF4UoXnSRvuNlnHCTlot2g/I2tQ5Si41UlHjlxxD3QuRDTwTQ4rARy3h24hSze/HrktRcSTbjAoGATH7MXeKhd0YAZbygkI12hmw7Jd2tJogUhNonsnqC5SrSTd/gB07XGz7Pe9pz+wYP/3k8r9BQRj2Z1CTgplYgNlgarHMOwDb2qiBT41sNYjTeCVqCDjwMSS2Hz/ftPQT2fnTSm7rPq8YiLu1L7ACxJus3OSGkgHT0NjYG4wNjloECgYEAtAUm6rDS+06V3g0ajyIqVPbdWvEQ6CKP7J9/FtujnnNYWhZf6BD3W0tzFIgryhjabHkP5uaR5TeyThSVwDBIZ3YX1Q8Y37B+KY04UwPSze5+x9ZMnY963ENGQ/Eq7cbjcgBLXIXL+3ftL/l8R3SwZAP2zLVf+yobjiQbBVKH50M="; }
        public static string AlipayPublicKey { get => "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0+vU+NpnwlJ7GpyzinZGyrQAULvfuoI/DVUOkOuUDEeoV1YooDpeSq8NsaByDI+SL0nDpZCSl/zSp0fO9/PjDqjQYTZi4R/L9lIjCrRUAnAD+8MydOxesDVPHS9h6+T7SDD9gYjVMKJcr2n2h6Uqc/uTLW1qOup/Mf229hawPOMwCSWmAan1fIztsxgt3L2l15pF6znsK46TD0uMGxUn9TrasoqOyas5LSBWOAYXSvIiVNy21f5LMv8jnddQ9ykujaNiPGZS2nvBHgph6DueznjqA6pIFp3/60V32DlJddUDMOkdUnsoDrvQwux1tEX4QkUl9nopkXKvmFvFKlR7jwIDAQAB"; }
        public static string AlipayCharset { get => "UTF-8"; }

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
