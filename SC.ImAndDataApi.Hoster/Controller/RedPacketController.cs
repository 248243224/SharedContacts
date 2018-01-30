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
        [HttpGet]
        public IHttpActionResult Get(int packetId)
        {
            try
            {
                return Ok(_redPacketService.Get(packetId));
            }
            catch (Exception ex)
            {
                Trace.TraceError($"RedPacketController::Get: {ex.Message}");
                return InternalServerError();
            }
        }

        [HttpGet]
        public IHttpActionResult GetByLocation(int userId, double lon, double lat, int instance = 1000)
        {
            try
            {
                return Ok(_redPacketService.GetByLocation(userId, lon, lat, instance));
            }
            catch (Exception ex)
            {
                Trace.TraceError($"RedPacketController::GetByLocation: {ex.Message}");
                return InternalServerError();
            }
        }

        [HttpPost]
        public IHttpActionResult OpenRedPacket(int userId, int packetId)
        {
            try
            {
                return Ok(_redPacketService.OpenRedPacketAsync(userId, packetId));
            }
            catch (Exception ex)
            {
                Trace.TraceError($"RedPacketController::GetByLocation: {ex.Message}");
                return InternalServerError();
            }
        }


        [HttpPost]
        public async Task<IHttpActionResult> Add()
        {
            string packetInfo;

            try
            {
                if (Request.Content.IsMimeMultipartContent())
                {
                    RedPacket packet = null;
                    var jsonSerializer = new JavaScriptSerializer();

                    var provider = new MultipartMemoryStreamProvider();
                    await Request.Content.ReadAsMultipartAsync(provider);
                    foreach (var part in provider.Contents)
                    {
                        var headers = part.Headers;

                        if (headers.ContentDisposition.Name.Contains("packetinfo"))
                        {
                            packetInfo = await part.ReadAsStringAsync();
                            packet = jsonSerializer.Deserialize<RedPacket>(packetInfo);
                        }
                        else if (headers.ContentDisposition.Name.Contains("files"))
                        {
                            using (Task<Byte[]> byteTask = part.ReadAsByteArrayAsync())
                            {
                                string fileName = Guid.NewGuid().ToString("N");
                                packet.ImageContent += $"{AttachmentCategory.RedPacketImg.ToString()}\\{fileName},";
                                File.WriteAllBytes(Path.Combine(SCEnvironment.RedPacketImgFolder, fileName), byteTask.Result);
                            }
                        }
                    }
                    packet.ImageContent?.TrimEnd(',');
                    packet.RestNumber = packet.TotalNumber;
                    packet.RestAmount = packet.Amount;
                    packet.CreateTime = DateTime.Now;
                    packet.MissNumber = 0;

                    _redPacketService.Add(packet);
                    return Ok();
                }
                else
                {
                    return BadRequest("This request is not properly formatted");
                }

            }
            catch (Exception ex)
            {
                Trace.TraceError($"RedPacketController::Add: {ex.Message}");
                return InternalServerError();
            }
        }
    }
}
