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
        public IHttpActionResult GetPagedList([FromUri]JqTableParams param)
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
        [HttpPost]
        public IHttpActionResult AddApply(int userId)
        {
            try
            {
                _withdrawService.AddApplyAsync(userId);
                return Ok();
            }
            catch (Exception ex)
            {
                Trace.TraceError($"WithdrawApplyController::AddApply: {ex.Message}");
                return InternalServerError();
            }
        }
        [HttpPost]
        public IHttpActionResult UpdateApplyStatus(int applyId, WithdrawApplyStatu statu)
        {
            try
            {
                _withdrawService.ChangeWithdrawApplyStatusAsync(applyId, statu);
                return Ok();
            }
            catch (Exception ex)
            {
                Trace.TraceError($"WithdrawApplyController::UpdateApplyStatus: {ex.Message}");
                return InternalServerError();
            }
        }
    }
}