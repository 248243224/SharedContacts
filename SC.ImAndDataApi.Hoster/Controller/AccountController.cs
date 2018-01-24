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

        [HttpGet]
        public IHttpActionResult LoginCallback(string wechatId)
        {
            try
            {
                var user = new SCUser();
                if (!_accountService.CheckUserExsit(wechatId))
                    _accountService.Register(user);
                _accountService.Login(user.UserId);
                return Ok();
            }
            catch (Exception ex)
            {
                Trace.TraceError($"UserContactsController::LoginCallback: {ex.Message}");
                return InternalServerError();
            }
        }
    }
}
