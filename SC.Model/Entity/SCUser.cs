﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SC.Model.Entity
{
    public class SCUser
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        public string OpenId { get; set; }
        public string UnionId { get; set; }
        [Required]
        [MaxLength(50, ErrorMessage = "姓名长度不能超过50")]
        public string Name { get; set; }
        [MaxLength(50, ErrorMessage = "支付宝账号长度不能超过50")]
        public string AliPay { get; set; }

        public DateTime CreateTime { get; set; }

        public Sex? Sex { get; set; }
        public string AvatarUrl { get; set; }

        public int? PId { get; set; }

        public AgencyType? AgencyType { get; set; }

        public DateTime? AgencyBeginTime { get; set; }

        public AccountStatus? AccountStatus { get; set; }

        public virtual List<RedPacket> RedPackets { get; set; }

        public virtual List<WithdrawApply> WithdrawApplys { get; set; }

        public virtual List<Profit> Profits { get; set; }
        public virtual List<MessageRecord> MessageRecords { get; set; }
    }

    public enum AgencyType
    {
        NotAgency,
        City,
        Country
    }

    public enum Sex
    {
        Male = 1,
        Female = 2
    }

    public enum AccountStatus
    {
        Normal,
        Disabled
    }
}
