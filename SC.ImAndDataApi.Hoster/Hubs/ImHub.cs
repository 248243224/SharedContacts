using System;
using System.Collections.Generic;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using SC.Model;
using System.Threading.Tasks;
using System.Linq;
using System.Diagnostics;
using SC.IService;

namespace SC.ImAndDataApi.Hoster.Hubs
{
    [HubName("SCImHub")]
    public class ImHub : Hub
    {
        static IMessageRecordService _messageRecordService;
        public ImHub(IMessageRecordService m)
        {
            _messageRecordService = m;
        }

        internal static void Send(Message msg)
        {
            try
            {
                _messageRecordService.AddAsync(msg.From, msg.To, msg.Content);

                var connectionId = FindConnectionId(msg.To);

                if (!string.IsNullOrWhiteSpace(connectionId))
                {
                    var _context = GlobalHost.ConnectionManager.GetHubContext<ImHub>();
                    _context.Clients.Client(connectionId).messageArrived(msg.From, msg.Content);
                }
            }
            catch (Exception ex)
            {
                Trace.TraceError("ImHub::Send:" + ex.Message);
            }
        }

        private static object lockObject = new object();
        private static List<UserConnectionMapping> _connectionMapping = new List<UserConnectionMapping>();
        private void AddOrUpdateConnection(int userId, string connectionId)
        {
            if (userId != 0)
            {
                lock (lockObject)
                {
                    var mapping = _connectionMapping.FirstOrDefault(m => m.UserId == userId);
                    if (mapping != null)
                    {
                        mapping.SignalRConnectionId = connectionId;
                        mapping.LastConnected = System.DateTime.UtcNow;
                    }
                    else
                    {
                        _connectionMapping.Add(new UserConnectionMapping { UserId = userId, LastConnected = System.DateTime.UtcNow, SignalRConnectionId = connectionId });
                    }
                }
            }
            else
            {
                Trace.TraceWarning("ImHub::AddOrUpdateConnection:incoming userid was null.  Not adding anything to the map");
            }
        }

        private void RemoveConnection(string connectionId)
        {
            var userId = _connectionMapping.FirstOrDefault(u => u.SignalRConnectionId.Equals(connectionId)).UserId;
            if (userId != 0)
            {
                lock (lockObject)
                {
                    _connectionMapping.RemoveAll(m => m.UserId.Equals(userId));
                }
            }
            else
            {
                Trace.TraceWarning("ImHub::RemoveConnection:incoming userid was null.  Not adding anything to the map");
            }
        }

        /// <summary>
        /// Returns empty string if not found
        /// </summary>
        /// <param name="blueDotKey"></param>
        /// <returns></returns>
        private static string FindConnectionId(int userId)
        {
            lock (lockObject)
            {
                var mappings = _connectionMapping.Where(m => m.UserId == userId).ToList();
                if (mappings.Count == 1)
                {
                    return mappings.First().SignalRConnectionId;
                }
                else if (mappings.Count > 1)
                {
                    var latest = mappings.FirstOrDefault(x => x.LastConnected == mappings.Max(y => y.LastConnected));
                    if (latest != null)
                    {
                        return latest.SignalRConnectionId;
                    }
                    else
                    {
                        Trace.TraceWarning("ImHub::FindConnectionId: signalR connection map, requested " + userId + " and got more than one, picked latest connected and got null");
                        return null;
                    }
                }
                else
                {
                    Trace.TraceWarning("ImHub::FindConnectionId: signalR connection map, requested " + userId + " and didn't find it in the map.  Cannot signal the client!");
                    return null;
                }
            }
        }

        public override Task OnConnected()
        {
            try
            {
                if (Context.QueryString.Any(q => q.Key.Equals("UserId")))
                {
                    var userId = Context.QueryString.FirstOrDefault(q => q.Key.Equals("UserId"));
                    var userIdValue = Convert.ToInt32(userId.Value);
                    AddOrUpdateConnection(userIdValue, Context.ConnectionId);
                }
            }
            catch (Exception ex)
            {
                Trace.TraceError("ImHub::OnConnected:" + ex.Message);
            }
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            try
            {
                RemoveConnection(Context.ConnectionId);
            }
            catch (Exception ex)
            {
                Trace.TraceError("ImHub::OnDisconnected:" + ex.Message);
            }
            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            try
            {
                if (Context.QueryString.Any(q => q.Key.Equals("UserId")))
                {
                    var userId = Context.QueryString.FirstOrDefault(q => q.Key.Equals("UserId"));
                    var userIdValue = Convert.ToInt32(userId.Value);
                    AddOrUpdateConnection(userIdValue, Context.ConnectionId);
                }
            }
            catch (Exception ex)
            {
                Trace.TraceError("ImHub::OnReconnected:" + ex.Message);
            }
            return base.OnReconnected();
        }

    }

    class UserConnectionMapping
    {
        public int UserId { get; set; }
        public string SignalRConnectionId { get; set; }
        public DateTime LastConnected { get; set; }
    }
}