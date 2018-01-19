using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.Model.Entity;

namespace SC.IService
{
    public interface IRedPacketService
    {
        IEnumerable<RedPacket> GetAll();
        void Add(RedPacket packet);
    }
}
