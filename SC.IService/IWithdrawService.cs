using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.Model.Entity;
using SC.Model;

namespace SC.IService
{
    public interface IWithdrawService
    {
        List<WithdrawApply> GetPagedList(JqTableParams param);

        void AddApplyAsync(int userId);
        void ChangeWithdrawApplyStatusAsync(int applyId, WithdrawApplyStatu statu);
        double GetNotWithdrawAmount(int userId);
    }
}
