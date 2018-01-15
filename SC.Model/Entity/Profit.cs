﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SC.Model.Entity
{
    public class Profit
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProfitId { get; set; }
        [Required]
        public float Amount { get; set; }
        [Required]
        public ProfitType Type { get; set; }
        public DateTime CreateTime { get; set; }

        [ForeignKey("SCUser")]
        public int UserId { get; set; }

        public virtual SCUser SCUser { get; set; }
    }

    public enum ProfitType {
        RedPacket,
    }
}
