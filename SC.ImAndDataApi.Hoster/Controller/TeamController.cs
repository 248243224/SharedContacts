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
    public class TeamController : ApiController
    {
        ISCUserService _scUserService;

        public TeamController(ISCUserService u)
        {
            _scUserService = u;
        }

        [HttpGet]
        public IHttpActionResult GetTeamMembers(int userId)
        {
            try
            {
                return Ok(_scUserService.GetTeamMembers(userId));
            }
            catch (Exception ex)
            {
                Trace.TraceError($"TeamController::GetTeamMembers: {ex.Message}");
                return InternalServerError();
            }
        }
    }
}
