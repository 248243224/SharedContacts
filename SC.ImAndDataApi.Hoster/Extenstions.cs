using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Cors;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SC.ImAndDataApi.Hoster
{
    public static class Extenstions
    {
        internal static IAppBuilder UseSignalr(this IAppBuilder app)
        {
            app.Map("/signalr", map =>
            {
                map.UseCors(CorsOptions.AllowAll);

                var hubConfig = new HubConfiguration { EnableDetailedErrors = true };
                map.RunSignalR(hubConfig);
            }
            );
            return app;
        }
    }
}
