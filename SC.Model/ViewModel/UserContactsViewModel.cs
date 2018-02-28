using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.Model.Entity;

namespace SC.Model.ViewModel
{
    public class UserContactsViewModel
    {
        public int FriendId { get; set; }
        public string FriendName { get; set; }
        public string FriendAvatar { get; set; }
        public string LastMessage { get; set; }
        public List<MessageRecord> MessageRecords { get; set; }
    }
}
