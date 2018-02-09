using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.IService;
using SC.Model.Entity;

namespace SC.Dal.Service
{
    public class ProfitService : IProfitService
    {
        public IEnumerable<Profit> GetUserProfits(int userId)
        {
            using (var context = SCContext.NewInstance)
            {
                return context.Profits.Where(p => p.UserId.Equals(userId)).ToList();
            }
        }
    }
}
