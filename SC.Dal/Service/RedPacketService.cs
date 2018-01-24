using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.IService;
using SC.Model.Entity;
using SC.Dal;
using SC.Common;
using SC.Model.ViewModel;

namespace SC.Dal.Service
{
    public class RedPacketService : IRedPacketService
    {
        public IEnumerable<RedPacket> GetAll()
        {
            using (var context = SCContext.NewInstance)
            {
                return context.RedPackets.ToList();
            }
        }
        public IEnumerable<RedPacket> GetByLocation(int userId, double lon, double lat, int instance)
        {
            using (var context = SCContext.NewInstance)
            {
                var query = context.RedPackets.Where(p => p.UserId.Equals(userId) && BaiduMap.GetLongDistance(lon, lat, p.Lng, p.Lat) <= instance && p.RestNumber > 0);
                return query.ToList();
            }
        }

        public RedPacketViewModel Get(int packetId)
        {
            RedPacketViewModel model = new RedPacketViewModel();

            using (var context = SCContext.NewInstance)
            {
                var packet = context.RedPackets.Include("SCUser").Where(p => p.PacketId.Equals(packetId)).FirstOrDefault();
                if (packet != null)
                {
                    model.UserId = packet.UserId;
                    model.TextContent = packet.TextContent;
                    model.ImageContent = packet.ImageContent;
                    model.CreateTime = packet.CreateTime;
                    model.Amount = packet.Amount;
                    model.Link = packet.Link;
                    model.AffectNumber = packet.TotalNumber - packet.RestNumber;
                    model.Username = packet.SCUser.Name ?? "";
                }
            }
            return model;
        }

        public RedPacketViewModel OpenRedPacket(int userId, int packetId)
        {
            RedPacketViewModel model = new RedPacketViewModel();
            RedPacketCheckRecord checkRecord = new RedPacketCheckRecord();
            Profit profit = new Profit();
            var checkTime = DateTime.Now;
            using (var context = SCContext.NewInstance)
            {
                var packet = context.RedPackets.Include("SCUser").Where(p => p.PacketId.Equals(packetId)).FirstOrDefault();
                var randomMoney = new Random().NextDouble(0.1, packet.RestAmount);
                if (packet != null)
                {
                    model.UserId = packet.UserId;
                    model.TextContent = packet.TextContent;
                    model.ImageContent = packet.ImageContent;
                    model.CreateTime = packet.CreateTime;
                    model.Amount = randomMoney;
                    model.Link = packet.Link;
                    model.AffectNumber = packet.TotalNumber - packet.RestNumber;
                    model.Username = packet.SCUser.Name ?? "";
                }
                //update packet info
                packet.RestAmount -= randomMoney;
                packet.RestNumber -= 1;
                //add packet record
                checkRecord.Amount = randomMoney;
                checkRecord.CheckTime = checkTime;
                checkRecord.PacketId = packet.PacketId;
                checkRecord.UserId = userId;

                context.RedPacketCheckRecords.Add(checkRecord);

                //add profit
                profit.Remark = $"来源于{model.Username}的红包";
                profit.Type = ProfitType.RedPacket;
                profit.UserId = userId;
                profit.CreateTime = checkTime;
                profit.Amount = randomMoney;
                profit.Status = ProfitStatus.NotWithdraw;

                context.Profits.Add(profit);

                context.SaveChangesAsync();
                return model;
            }
        }

        public void Add(RedPacket packet)
        {
            using (var context = SCContext.NewInstance)
            {
                context.RedPackets.Add(packet);
                context.SaveChanges();
            }
        }
    }
}
