using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.Model.Entity;
using SC.Model.ViewModel;

namespace SC.IService
{
    public interface ISCUserService
    {
        UserInfoViewModel GetUserInfo(int userId);
        void UpdateUserInfoAsync(UserInfoViewModel userInfo);
    }
}
