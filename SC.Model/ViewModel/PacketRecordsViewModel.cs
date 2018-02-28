using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SC.Model.ViewModel
{
    public class PacketRecordsViewModel
    {
        public Recieved Recieved { get; set; }
        public Send Send { get; set; }
    }

    public class Recieved
    {
        public Recieved()
        {
            PacketList = new List<RedPacketViewModel>();
        }

        public double Amount { get; set; }
        public double Largest { get; set; }
        public List<RedPacketViewModel> PacketList { get; set; }
    }
    public class Send
    {
        public Send()
        {
            PacketList = new List<RedPacketViewModel>();
        }
        public double Amount { get; set; }
        public double Largest { get; set; }
        public List<RedPacketViewModel> PacketList { get; set; }
    }
}
