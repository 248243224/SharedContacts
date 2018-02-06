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

        public PacketRecordsViewModel GetRecords(int userId)
        {
            PacketRecordsViewModel model = new PacketRecordsViewModel();
            model.Recieved = new Recieved();
            model.Send = new Send();
            using (var context = SCContext.NewInstance)
            {
                var checkRecords = context.RedPacketCheckRecords.Include("RedPacket.SCUser").Where(p => p.UserId == userId);
                var checkRecordsAmouts = checkRecords.Select(p => p.Amount);
                var sendRecords = context.RedPackets.Include("SCUser").Where(p => p.UserId == userId).Select(packet => new RedPacketViewModel
                {
                    UserId = packet.UserId,
                    Username = packet.SCUser.Name,
                    UserAvatar = packet.SCUser.AvatarUrl,
                    CreateTime = packet.CreateTime,
                    AffectNumber = packet.TotalNumber - packet.RestNumber,
                    Amount = packet.Amount,
                    ImageContentString = packet.ImageContent,
                    Link = packet.Link,
                    TextContent = packet.TextContent
                });
                var sendRecordAmounts = sendRecords.Select(r => r.Amount);
                model.Send.Amount = Math.Round(sendRecordAmounts.Sum(), 2);
                model.Send.Largest = Math.Round(sendRecordAmounts.Max(), 2);
                model.Send.PacketList = sendRecords.OrderByDescending(r => r.CreateTime).ToList();
                model.Send.PacketList.ForEach(p =>
                {
                    p.ImageContent = p.ImageContentString.TrimEnd(',').Split(',').ToList();
                });

                model.Recieved.Amount = Math.Round(checkRecordsAmouts.Sum(), 2);
                model.Recieved.Largest = Math.Round(checkRecordsAmouts.Max(), 2);
                model.Recieved.PacketList = checkRecords.Select(r => new RedPacketViewModel
                {
                    UserId = r.RedPacket.UserId,
                    Username = r.RedPacket.SCUser.Name,
                    UserAvatar = r.RedPacket.SCUser.AvatarUrl,
                    CreateTime = r.RedPacket.CreateTime,
                    AffectNumber = r.RedPacket.TotalNumber - r.RedPacket.RestNumber,
                    Amount = r.RedPacket.Amount,
                    ImageContentString = r.RedPacket.ImageContent,
                    Link = r.RedPacket.Link,
                    TextContent = r.RedPacket.TextContent
                }).OrderByDescending(r => r.CreateTime).ToList();
                model.Recieved.PacketList.ForEach(p =>
                {
                    p.ImageContent = p.ImageContentString.TrimEnd(',').Split(',').ToList();
                });
            }
            return model;
        }

        public IEnumerable<RedPacket> GetByLocation(int userId, double lon, double lat, string city, int agencyType, int instance)
        {
            var retList = new List<RedPacket>();
            var cityList = new List<RedPacket>();
            using (var context = SCContext.NewInstance)
            {
                cityList = agencyType == (int)AgencyType.Country ? context.RedPackets.Include("CheckRecords").Where(p => p.RestNumber > 0
                && !p.CheckRecords.Any(r => r.UserId == userId)).ToList()
                    : context.RedPackets.Where(p => p.City.Equals(city) && p.RestNumber > 0 && !p.CheckRecords.Any(r => r.UserId == userId)).ToList();
            }
            if (agencyType != (int)AgencyType.NotAgency) retList.AddRange(cityList);
            else
            {
                cityList.ForEach(p =>
                {
                    if (BaiduMap.GetLongDistance(lon, lat, p.Lng, p.Lat) <= instance) retList.Add(p);
                });
            }
            return retList;
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
                    model.ImageContent = packet.ImageContent.TrimEnd(',').Split(',').ToList();
                    model.CreateTime = packet.CreateTime;
                    model.Amount = packet.Amount;
                    model.Link = packet.Link;
                    model.AffectNumber = packet.TotalNumber - packet.RestNumber;
                    model.Username = packet.SCUser.Name ?? "";
                    model.UserAvatar = packet.SCUser.AvatarUrl ?? "";
                }
            }
            return model;
        }
        public async Task<RedPacketViewModel> OpenRedPacketAsync(int userId, int packetId)
        {
            RedPacketViewModel model = new RedPacketViewModel();
            RedPacketCheckRecord checkRecord = new RedPacketCheckRecord();
            Profit profit = new Profit();
            var checkTime = DateTime.Now;
            using (var context = SCContext.NewInstance)
            {
                var packet = context.RedPackets.Include("SCUser").Where(p => p.PacketId.Equals(packetId)).FirstOrDefault();
                var randomMoney = Math.Round(new Random().NextDouble(0.1, packet.RestAmount / 4), 2);
                if (packet != null)
                {
                    model.UserId = packet.UserId;
                    model.TextContent = packet.TextContent;
                    model.ImageContent = packet.ImageContent.TrimEnd(',').Split(',').ToList();
                    model.CreateTime = packet.CreateTime;
                    model.Amount = randomMoney;
                    model.Link = packet.Link;
                    model.AffectNumber = packet.TotalNumber - packet.RestNumber;
                    model.Username = packet.SCUser.Name ?? "";
                    model.UserAvatar = packet.SCUser.AvatarUrl ?? "";
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
                profit.Remark = $"来至{model.Username}";
                profit.Type = ProfitType.RedPacket;
                profit.UserId = userId;
                profit.CreateTime = checkTime;
                profit.Amount = randomMoney;
                profit.Status = ProfitStatus.NotWithdraw;

                context.Profits.Add(profit);

                await context.SaveChangesAsync();
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
