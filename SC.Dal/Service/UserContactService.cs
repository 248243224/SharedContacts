using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.IService;
using SC.Model.ViewModel;
using System.Text.RegularExpressions;
using SC.Common;
using SC.Model.Entity;

namespace SC.Dal.Service
{
    public class UserContactService : IUserContactService
    {
        public IEnumerable<UserContactsViewModel> GetContacts(int userId)
        {
            var contacts = new List<UserContactsViewModel>();
            var friendIds = new List<int>();
            using (var context = SCContext.NewInstance)
            {
                friendIds.AddRange(context.UserContacts.Where(u => u.UserId.Equals(userId)).Select(u => u.FriendId));
                friendIds.AddRange(context.UserContacts.Where(u => u.FriendId.Equals(userId)).Select(u => u.UserId));

                friendIds.ForEach(f =>
                {
                    var friendInfo = context.SCUsers.Where(u => u.UserId.Equals(f)).FirstOrDefault();
                    var messageRecords = context.MessageRecords.Where(m => m.UserId.Equals(userId) && m.FriendId.Equals(f)).OrderByDescending(m => m.CreateTime).ToList();
                    string lastMessage = Regex.Split(Regex.Split(messageRecords?.FirstOrDefault().Content, $"<{userId}>").LastOrDefault(), $"<{f}>").LastOrDefault();

                    UserContactsViewModel model = new UserContactsViewModel();
                    model.FriendId = f;
                    model.FriendName = friendInfo.Name;
                    model.MessageRecords = messageRecords;
                    model.LastMessage = lastMessage;

                    contacts.Add(model);
                });
            }
            return contacts;
        }

        public async void AddContactsAsync(int userId, int friendId)
        {
            using (var context = SCContext.NewInstance)
            {
                var contact = context.UserContacts.Where(u => (u.UserId.Equals(userId) && u.FriendId.Equals(friendId))
                || (u.UserId.Equals(friendId) && u.FriendId.Equals(userId))).FirstOrDefault();
                if (contact != null) return;
                var userContact = new UserContact()
                {
                    CreateTime = DateTime.Now,
                    FriendId = friendId,
                    UserId = userId
                };
                await context.SaveChangesAsync();
            }
        }
    }
}
