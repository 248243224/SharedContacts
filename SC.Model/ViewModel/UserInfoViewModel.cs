using SC.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SC.Model.ViewModel
{
    public class UserInfoViewModel
    {
        public int UserId { get; set; }
        public string OpenId { get; set; }
        public string UnionId { get; set; }
        public string Name { get; set; }
        public string AliPay { get; set; }

        public DateTime CreateTime { get; set; }

        public Sex? Sex { get; set; }
        public string AvatarUrl { get; set; }

        public int? PId { get; set; }

        public AgencyType? AgencyType { get; set; }

        public DateTime? AgencyBeginTime { get; set; }

        public AccountStatus? AccountStatus { get; set; }

        public double RecieveAmount { get; set; }
        public double SendAmount { get; set; }

        public double TodayProfit { get; set; }
        public double MonthProfit { get; set; }
        public double TotalProfit { get; set; }

        public double NotWithdrawProfit { get; set; }
    }
}
