using System;
using System.Collections.Generic;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using SC.Model;

namespace SC.ImAndDataApi.Hoster.Hubs
{
    [HubName("SCImHub")]
    public class ImHub : Hub
    {
        internal static void Send(Message msg)
        {
            var _context = GlobalHost.ConnectionManager.GetHubContext<ImHub>();
            _context.Clients.All.messageArrived(msg.Content);
        }
    }
}