using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using SC.IService;
using SC.Model.Entity;
using System.Diagnostics;

namespace SC.ImAndDataApi.Hoster.Controller
{
    public class RedPacketController : ApiController
    {
        IRedPacketService _redPacketService;

        public RedPacketController(IRedPacketService r)
        {
            _redPacketService = r;
        }
        [HttpGet]
        public IHttpActionResult GetAll()
        {
            try
            {
                return Ok(_redPacketService.GetAll());
            }
            catch (Exception ex)
            {
                Trace.TraceError($"RedPacketController::GetAll: {ex.Message}");
                return InternalServerError();
            }
        }
    }
}
