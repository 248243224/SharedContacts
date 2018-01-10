using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using SC.ImAndDataApi.Hoster.Hubs;
using SC.Model;

namespace SC.ImAndDataApi.Hoster.Controller
{
    public class MessageController : ApiController
    {
        [HttpGet]
        public IHttpActionResult Send(string content)
        {
            ImHub.Send(new Message
            {
                Content = content
            });

            return Ok();
        }
    }
}
