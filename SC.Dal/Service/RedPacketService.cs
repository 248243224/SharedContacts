﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.IService;
using SC.Model.Entity;
using SC.Dal;

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
    }
}
