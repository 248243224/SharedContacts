using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.Model.Entity;

namespace SC.Model.ViewModel
{
    public class RedPacketViewModel
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string UserAvatar { get; set; }
        public DateTime CreateTime { get; set; }
        public double Amount { get; set; }
        public int AffectNumber { get; set; }
        public string TextContent { get; set; }
        public string Link { get; set; }
        public List<string> ImageContent { get; set; }
        //split by ","
        public string ImageContentString { get; set; }

        public static RedPacketViewModel FromRedPacket(RedPacket packet)
        {
            return new RedPacketViewModel
            {
                UserId = packet.UserId,
                Username = packet.SCUser.Name,
                UserAvatar = packet.SCUser.AvatarUrl,
                CreateTime = packet.CreateTime,
                AffectNumber = packet.TotalNumber - packet.RestNumber,
                Amount = packet.Amount,
                ImageContent = packet.ImageContent.TrimEnd(',').Split(',').ToList(),
                Link = packet.Link,
                TextContent = packet.TextContent
            };
        }
    }
}
