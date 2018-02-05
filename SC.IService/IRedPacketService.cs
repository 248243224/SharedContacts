using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.Model.Entity;
using SC.Model.ViewModel;

namespace SC.IService
{
    public interface IRedPacketService
    {
        IEnumerable<RedPacket> GetAll();
        RedPacketViewModel Get(int packetId);
        IEnumerable<RedPacket> GetByLocation(int userId, double lon, double lat,string city, int agencyType, int instance);
        Task<RedPacketViewModel> OpenRedPacketAsync(int userId, int packetId);
        void Add(RedPacket packet);
    }
}
