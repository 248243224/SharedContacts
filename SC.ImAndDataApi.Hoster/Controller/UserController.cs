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
    public class UserController : ApiController
    {
        ISCUserService _scUserService;

        public UserController(ISCUserService u)
        {
            _scUserService = u;
        }

        [HttpGet]
        public IHttpActionResult GetUserInfo(int userId)
        {
            try
            {
                var userInfo = _scUserService.GetUserInfo(userId);
                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                Trace.TraceError($"UserController::GetUserInfo: {ex.Message}");
                return InternalServerError();
            }
        }

        [HttpPost]
        public async Task<IHttpActionResult> UpdateUserInfo([FromBody]UserInfoViewModel userInfo)
        {
            try
            {
                var updatedUser = await _scUserService.UpdateUserInfoAsync(userInfo);
                return Ok(updatedUser);
            }
            catch (Exception ex)
            {
                Trace.TraceError($"UserController::UpdateUserInfo: {ex.Message}");
                return InternalServerError();
            }
        }

    }
}
