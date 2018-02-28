using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.IService;
using SC.Model.Entity;

namespace SC.Dal.Service
{
    public class AccountService : IAccountService
    {
        public bool CheckUserExsit(string openId)
        {
            using (var context = SCContext.NewInstance)
            {
                var user = context.SCUsers.FirstOrDefault(u => u.OpenId == openId);
                return user == null ? false : true;
            }
        }
        public async void Register(SCUser user)
        {
            using (var context = SCContext.NewInstance)
            {
                context.SCUsers.Add(user);
                await context.SaveChangesAsync();
            }
        }
        public SCUser GetUserInfoByOpenId(string openId)
        {
            using (var context = SCContext.NewInstance)
            {
                return context.SCUsers.FirstOrDefault(u => u.OpenId.Equals(openId));
            }
        }
    }
}
