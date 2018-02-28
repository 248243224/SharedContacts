using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Collections.Generic;
using System.Configuration;

namespace SC.Admin
{
    public class AccountController : BaseController
    {
        //
        // GET: /Account/Index
        public ActionResult Index()
        {
            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        public async Task<ActionResult> Login()
        {
            return View();
        }
    }
}