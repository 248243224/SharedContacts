using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SC.IService;
using SC.Model.Entity;
using System.Web.Http;
using SC.Model;
using System.Diagnostics;

namespace SC.Admin.Controllers
{
    public class WithdrawApplyController : ApiController
    {
        IWithdrawService _withdrawService;

        public WithdrawApplyController(IWithdrawService w)
        {
            _withdrawService = w;
        }

        [HttpGet]
        public IHttpActionResult GetPagedList(JqTableParams param)
        {
            try
            {
                var applyList = _withdrawService.GetPagedList(param);

                return Ok(new JqTableData<WithdrawApply>()
                {
                    sEcho = param.sEcho,
                    iTotalRecords = applyList.Count,
                    iTotalDisplayRecords = applyList.Count,
                    aaData = applyList
                });
            }
            catch (Exception ex)
            {
                Trace.TraceError($"WithdrawApplyController::GetPagedList: {ex.Message}");
                return InternalServerError();
            }
        }
    }
}