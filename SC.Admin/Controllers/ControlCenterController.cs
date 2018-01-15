using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SC.Admin
{
    public class ControlCenterController : BaseController
    {

        // GET: Home
        public ActionResult Page()
        {
            return View();
        }

        public ActionResult Home()
        {
            return View();
        }
    }
}