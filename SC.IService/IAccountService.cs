using SC.Model.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SC.IService
{
    public interface IAccountService
    {
        bool CheckUserExsit(string wechatId);
        void Register(SCUser user);
        void Login(int userId);
    }
}
