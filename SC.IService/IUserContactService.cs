using SC.Model.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SC.IService
{
    public interface IUserContactService
    {
        IEnumerable<UserContactsViewModel> GetContacts(int userId);
        void AddContactsAsync(int userId, int friendId);
    }
}
