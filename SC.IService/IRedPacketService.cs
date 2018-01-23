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
        IEnumerable<RedPacket> GetByLocation(int userid, double lon, double lat, int instance);
        RedPacketViewModel OpenRedPacket(int userId, int packetId);
        void Add(RedPacket packet);
    }
}
