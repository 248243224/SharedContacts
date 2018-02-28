using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using SC.Common;
using SC.IService;
using System.Diagnostics;
using System.Net.Http;
using System.Net;
using System.Net.Http.Headers;

namespace SC.ImAndDataApi.Hoster.Controller
{
    public class AttachmentController : ApiController
    {
        IAttachmentService _attachmentService;

        public AttachmentController(IAttachmentService a)
        {
            _attachmentService = a;
        }

        [HttpGet]
        public HttpResponseMessage GetFileStream(string url)
        {
            try
            {
                HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
                result.Content = new StreamContent(_attachmentService.GetFileStream(url));
                //if you want to get files instead of stream, just uncomment below codes
                //result.Content.Headers.ContentType =
                //    new MediaTypeHeaderValue("application/octet-stream");
                return result;

            }
            catch (Exception ex)
            {
                Trace.TraceError($"AttachmentController::GetFileStream: {ex.Message}");
                return new HttpResponseMessage(HttpStatusCode.InternalServerError);
            }
        }
        [HttpPut]
        public IHttpActionResult GetFileContent(string url)
        {
            try
            {
                return Ok(_attachmentService.GetFileString(url));
            }
            catch (Exception ex)
            {
                Trace.TraceError($"AttachmentController::GetFileContent: {ex.Message}");
                return InternalServerError();
            }
        }
    }
}
