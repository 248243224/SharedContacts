﻿using SC.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.Model.Entity;

namespace SC.IService
{
    public interface IAccountService
    {
        bool CheckUserExsit(string openId);
        void Register(SCUser user);
        SCUser GetUserInfoByOpenId(string openId);
    }
}
