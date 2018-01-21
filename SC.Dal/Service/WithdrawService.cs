using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.IService;
using SC.Model.Entity;
using SC.Model;

namespace SC.Dal.Service
{
    public class WithdrawService : IWithdrawService
    {
        public List<WithdrawApply> GetPagedList(JqTableParams param)
        {
            string searchValue = param.sSearch == null ? string.Empty : param.sSearch.Trim();//项目编号或项目名称或操作人员
            DateTime? startTime = null;//操作日志创建时间
            DateTime? endTime = null;
            if (!string.IsNullOrEmpty(param.sDateTimeRange))
            {
                startTime = Convert.ToDateTime(param.sDateTimeRange.Replace(" - ", ",").Split(',')[0]);
                endTime = Convert.ToDateTime(param.sDateTimeRange.Replace(" - ", ",").Split(',')[1]);
            }
            startTime = startTime ?? Convert.ToDateTime("2016-01-01 00:00:00");//时间区间默认值
            endTime = endTime ?? Convert.ToDateTime("2099-01-01 00:00:00");//时间区间默认值

            using (var context = SCContext.NewInstance)
            {
                var orderQuery = context.WithdrawApplys.Include("SCUser").OrderByDescending(w => w.ApplyTime);
                var query = orderQuery.Where(w => (w.SCUser.Name.Contains(searchValue) || w.SCUser.WechatId.Contains(searchValue)) && (w.ApplyTime >= startTime
                       && w.ApplyTime <= endTime));//根据微信号或姓名查询
                return query.Skip(param.iDisplayStart).Take(param.iDisplayLength).ToList();
            }
        }
    }
}
