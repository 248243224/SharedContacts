﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SC.Model.Entity
{
    public class RedPacket
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PacketId { get; set; }
        [Required]
        public double Amount { get; set; }
        [Required]
        public double RestAmount { get; set; }
        [Required]
        public double Lng { get; set; }
        [Required]
        public double Lat { get; set; }
        [Required]
        [MaxLength(50, ErrorMessage = "城市名长度不能超过50")]
        public string City { get; set; }
        [Required]
        public int TotalNumber { get; set; }
        public int RestNumber { get; set; }
        [NotMapped]
        public int MissNumber { get; set; }
        [MaxLength(200, ErrorMessage = "红包文字内容长度不能超过200")]
        public string TextContent { get; set; }
        /// <summary>
        /// split by “,”
        /// </summary>
        public string ImageContent { get; set; }
        [MaxLength(100, ErrorMessage = "外部链接长度不能超过100")]
        public string Link { get; set; }

        public DateTime CreateTime { get; set; }

        [ForeignKey("SCUser")]
        public int UserId { get; set; }

        public virtual SCUser SCUser { get; set; }

        public virtual List<RedPacketCheckRecord> CheckRecords { get; set; }
    }
}
