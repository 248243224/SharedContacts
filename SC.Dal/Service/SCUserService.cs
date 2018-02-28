using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.IService;
using SC.Model.ViewModel;
using SC.Model.Entity;
using SC.Common;

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
                model.OpenId = user.OpenId;
                model.AliPay = user.AliPay;
                model.AgencyType = user.AgencyType;
                model.AvatarUrl = user.AvatarUrl;
                model.AgencyBeginTime = user.AgencyBeginTime;
                model.CreateTime = user.CreateTime;
                try
                {
                    model.RecieveAmount = Math.Round(context.RedPacketCheckRecords.Where(p => p.UserId == userId).Select(p => p.Amount).ToList().Sum(), 2);
                }
                catch { model.RecieveAmount = 0; }
                try
                {
                    model.SendAmount = Math.Round(context.RedPackets.Where(p => p.UserId == userId).Select(p => p.Amount).ToList().Sum(), 2);
                }
                catch { model.SendAmount = 0; }

                var profitList = context.Profits.Where(p => p.UserId.Equals(userId)).ToList();

                model.TodayProfit = profitList.Where(p => p.CreateTime.Date == DateTime.Today).Select(p => p.Amount).Sum();
                model.MonthProfit = profitList.Where(p => p.CreateTime.Year == DateTime.Now.Year && p.CreateTime.Month == DateTime.Now.Month).Select(p => p.Amount).Sum();
                model.TotalProfit = profitList.Select(p => p.Amount).Sum();
                model.NotWithdrawProfit = profitList.Where(p => p.Status == ProfitStatus.NotWithdraw).Select(p => p.Amount).Sum();

                return model;
            }
        }

        public IEnumerable<UserInfoViewModel> GetTeamMembers(int userId)
        {
            var members = new List<UserInfoViewModel>();
            using (var context = SCContext.NewInstance)
            {
                var users = context.SCUsers.Where(u => u.PId == userId).ToList();
                if (users.Count() == 0) return members;
                users.ForEach(user =>
                {
                    UserInfoViewModel model = new UserInfoViewModel();
                    model.UserId = user.UserId;
                    model.PId = user.PId;
                    model.Name = user.Name;
                    model.Sex = user.Sex;
                    model.OpenId = user.OpenId;
                    model.AliPay = user.AliPay;
                    model.AgencyType = user.AgencyType;
                    model.AvatarUrl = user.AvatarUrl;
                    model.AgencyBeginTime = user.AgencyBeginTime;
                    model.CreateTime = user.CreateTime;

                    try
                    {
                        model.RecieveAmount = Math.Round(context.RedPacketCheckRecords.Where(p => p.UserId == user.UserId).Select(p => p.Amount).ToList().Sum(), 2);
                    }
                    catch { model.RecieveAmount = 0; }
                    try
                    {
                        model.SendAmount = Math.Round(context.RedPackets.Where(p => p.UserId == user.UserId).Select(p => p.Amount).ToList().Sum(), 2);
                    }
                    catch { model.SendAmount = 0; }

                    var profitList = context.Profits.Where(p => p.UserId.Equals(user.UserId)).ToList();

                    model.TodayProfit = profitList.Where(p => p.CreateTime.Date == DateTime.Today).Select(p => p.Amount).Sum();
                    model.MonthProfit = profitList.Where(p => p.CreateTime.Year == DateTime.Now.Year && p.CreateTime.Month == DateTime.Now.Month).Select(p => p.Amount).Sum();
                    model.TotalProfit = profitList.Select(p => p.Amount).Sum();
                    model.NotWithdrawProfit = profitList.Where(p => p.Status == ProfitStatus.NotWithdraw).Select(p => p.Amount).Sum();
                    members.Add(model);
                });

                return members;
            }
        }

        public async Task<SCUser> UpdateUserInfoAsync(UserInfoViewModel userInfo)
        {
            using (var context = SCContext.NewInstance)
            {
                var user = context.SCUsers.FirstOrDefault(u => u.UserId.Equals(userInfo.UserId));
                if (userInfo.Sex != null) user.Sex = userInfo.Sex;
                if (userInfo.PId != null) user.PId = userInfo.PId;
                if (userInfo.AccountStatus != null) user.AccountStatus = userInfo.AccountStatus;
                if (!string.IsNullOrWhiteSpace(userInfo.AliPay)) user.AliPay = userInfo.AliPay;
                if (userInfo.AgencyType != null)
                {
                    user.AgencyType = userInfo.AgencyType;
                    user.AgencyBeginTime = DateTime.Now;
                    //update agency type means buy agency, so update profits
                    var parents = new List<SCUser>();
                    GetParents(userInfo.PId, parents);
                    parents = parents.OrderBy(p => p.UserId).ToList();
                    for (int index = 0; index < parents.Count(); index++)
                    {
                        var profit = default(Profit);
                        if (index < 2)
                        {
                            profit = new Profit
                            {
                                CreateTime = DateTime.Now,
                                Status = ProfitStatus.NotWithdraw,
                                UserId = userInfo.UserId,
                                Type = parents[index].AgencyType == AgencyType.City ? ProfitType.CityAgent : ProfitType.CountryAgent,
                                Amount = SCEnvironment.CityAgencyPrice * SCEnvironment.AgencyProfitPercent,
                                Remark = $"来源于{userInfo.Name}购买的城市代理"
                            };
                        }
                        else
                        {
                            if (parents[index].AgencyType == AgencyType.Country)
                            {
                                profit = new Profit
                                {
                                    CreateTime = DateTime.Now,
                                    Status = ProfitStatus.NotWithdraw,
                                    UserId = userInfo.UserId,
                                    Type = ProfitType.CountryAgent,
                                    Amount = SCEnvironment.CountryAgencyPrice * SCEnvironment.AgencyProfitPercent,
                                    Remark = $"来源于{userInfo.Name}购买的全国代理"
                                };
                            }
                        }
                        context.Profits.Add(profit);
                    }
                }
                if (!string.IsNullOrWhiteSpace(userInfo.Name)) user.Name = userInfo.Name;
                await context.SaveChangesAsync();
                return user;
            }
        }

        private void GetParents(int? parentId, List<SCUser> parents)
        {
            using (var context = SCContext.NewInstance)
            {
                var parent = context.SCUsers.FirstOrDefault(u => u.UserId == parentId);
                if (parent != null)
                {
                    parents.Add(parent);
                    if (parent.PId != null) GetParents(parent.PId, parents);
                }
            }
        }
    }
}
