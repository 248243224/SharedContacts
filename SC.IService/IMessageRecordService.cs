using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SC.IService
{
    public interface IMessageRecordService
    {
        void AddAsync(int userId, int friendId, string content);
    }
}
