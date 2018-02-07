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

namespace SC.ImAndDataApi.Hoster.Controller
{
    public class AccountController : ApiController
    {
        IAccountService _accountService;

        public AccountController(IAccountService a)
        {
            _accountService = a;
        }

        [HttpPost]
        public IHttpActionResult LoginOrRegister([FromBody]SCUser user)
        {
            try
            {
                if (!_accountService.CheckUserExsit(user.OpenId))
                {
                    user.AccountStatus = 0;
                    user.AgencyType = AgencyType.NotAgency;
                    user.CreateTime = DateTime.Now;
                    _accountService.Register(user);
                }
                var userInfo = _accountService.GetUserInfoByOpenId(user.OpenId);
                return Ok(userInfo);
            }
            catch (Exception ex)
            {
                Trace.TraceError($"UserContactsController::LoginCallback: {ex.Message}");
                return InternalServerError();
            }
        }
    }
}
