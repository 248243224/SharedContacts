using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SC.Model.ViewModel
{
    public class RedPacketViewModel
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public DateTime CreateTime { get; set; }
        public double Amount { get; set; }
        public int AffectNumber { get; set; }
        public string TextContent { get; set; }
        /// <summary>
        /// split by “,”
        /// </summary>
        public string ImageContent { get; set; }
    }
}
