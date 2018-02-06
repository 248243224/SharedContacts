using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using SC.IService;
using SC.Model.Entity;
using System.Diagnostics;
using System.Net.Http;
using System.Net;
using SC.Common;
using System.IO;
using System.Web.Script.Serialization;

namespace SC.ImAndDataApi.Hoster.Controller
{
    public class PacketRecordController: ApiController
    {
        IRedPacketService _redPacketService;

        public PacketRecordController(IRedPacketService r)
        {
            _redPacketService = r;
        }

        [HttpGet]
        public IHttpActionResult Get(int userId)
        {
            try
            {
                return Ok(_redPacketService.GetRecords(userId));
            }
            catch (Exception ex)
            {
                Trace.TraceError($"PacketRecordController::Get: {ex.Message}");
                return InternalServerError();
            }
        }
    }
}
