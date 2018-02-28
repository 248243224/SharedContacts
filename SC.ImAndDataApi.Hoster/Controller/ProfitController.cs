using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SC.IService;
using SC.Model.Entity;
using System.Web.Http;
using SC.Model;
using System.Diagnostics;
using SC.Model.ViewModel;
using System.Threading.Tasks;

namespace SC.ImAndDataApi.Hoster.Controller
{
    public class ProfitController : ApiController
    {
        IProfitService _profitService;

        public ProfitController(IProfitService p)
        {
            _profitService = p;
        }

        [HttpGet]
        public IHttpActionResult GetUserProfits(int userId)
        {
            try
            {
                return Ok(_profitService.GetUserProfits(userId));
            }
            catch (Exception ex)
            {
                Trace.TraceError($"ProfitController::GetUserProfits: {ex.Message}");
                return InternalServerError();
            }
        }
    }
}
