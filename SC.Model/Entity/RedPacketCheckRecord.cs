﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SC.Model.Entity
{
    public class RedPacketCheckRecord
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CheckId { get; set; }
        public DateTime CheckTime { get; set; }
        public double Amount { get; set; }
        [ForeignKey("RedPacket")]
        public int PacketId { get; set; }

        public virtual RedPacket RedPacket { get; set; }

        public int UserId { get; set; }
    }
}
