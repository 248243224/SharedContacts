using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.IService;
using SC.Model.ViewModel;
using SC.Model.Entity;

namespace SC.Dal.Service
{
    public class SCUserService : ISCUserService
    {
        public UserInfoViewModel GetUserInfo(int userId)
        {
            using (var context = SCContext.NewInstance)
            {
                var user = context.SCUsers.Where(u => u.UserId.Equals(userId)).FirstOrDefault();
                if (user == null) return null;

                UserInfoViewModel model = new UserInfoViewModel();
                model.UserId = userId;
                model.PId = user.PId;
                model.Name = user.Name;
                model.Sex = user.Sex;
                model.WechatId = user.WechatId;
                model.AliPay = user.AliPay;
                model.AgencyType = user.AgencyType;
                model.AvatarUrl = user.AvatarUrl;
                model.AgencyBeginTime = user.AgencyBeginTime;
                model.CreateTime = user.CreateTime;

                model.TodayProfit = context.Profits
                                 .Where(p => p.UserId.Equals(userId) && p.CreateTime.Date == DateTime.Today)
                                 .Select(p => p.Amount).Sum();

                model.MonthProfit = context.Profits
                                 .Where(p => p.UserId.Equals(userId) && p.CreateTime.Year == DateTime.Now.Year && p.CreateTime.Month == DateTime.Now.Month)
                                 .Select(p => p.Amount).Sum();

                model.TodayProfit = context.Profits
                          .Where(p => p.UserId.Equals(userId))
                          .Select(p => p.Amount).Sum();

                model.NotWithdrawProfit = context.Profits
                          .Where(p => p.UserId.Equals(userId) && p.Status == ProfitStatus.NotWithdraw)
                          .Select(p => p.Amount).Sum();

                return model;
            }
        }

        public void UpdateUserInfo(UserInfoViewModel userInfo)
        {
            using (var context = SCContext.NewInstance)
            {
                var user = context.SCUsers.FirstOrDefault(u => u.UserId.Equals(userInfo.UserId));
                if (userInfo.Sex != null) user.Sex = userInfo.Sex;
                if (userInfo.AccountStatus != null) user.AccountStatus = userInfo.AccountStatus;
                if (!string.IsNullOrWhiteSpace(userInfo.AliPay)) user.AliPay = userInfo.AliPay;
                if (userInfo.AgencyType != null)
                {
                    user.AgencyType = userInfo.AgencyType;
                    user.AgencyBeginTime = DateTime.Now;
                }
                if (!string.IsNullOrWhiteSpace(userInfo.Name)) user.Name = userInfo.Name;
                context.SaveChangesAsync();
            }
        }
    }
}
