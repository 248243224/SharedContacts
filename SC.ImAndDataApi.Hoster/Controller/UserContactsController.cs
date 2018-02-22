using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SC.IService;
using SC.Model.Entity;
using System.Web.Http;
using SC.Model;
using System.Diagnostics;
using System.Threading.Tasks;

namespace SC.ImAndDataApi.Hoster.Controller
{
    public class UserContactsController : ApiController
    {
        IUserContactService _userContactService;

        public UserContactsController(IUserContactService u)
        {
            _userContactService = u;
        }

        [HttpGet]
        public IHttpActionResult GetContacts(int userId)
        {
            try
            {
                var contacts = _userContactService.GetContacts(userId);
                return Ok(contacts);
            }
            catch (Exception ex)
            {
                Trace.TraceError($"UserContactsController::GetContacts: {ex.Message}");
                return InternalServerError();
            }
        }
        [HttpPost]
        public async Task<IHttpActionResult> AddContacts(int userId, int friendId)
        {
            try
            {
                var ret = await _userContactService.AddContactsAsync(userId, friendId);
                return Ok(ret);
            }
            catch (Exception ex)
            {
                Trace.TraceError($"UserContactsController::AddContacts: {ex.Message}");
                return InternalServerError();
            }
        }
    }
}
