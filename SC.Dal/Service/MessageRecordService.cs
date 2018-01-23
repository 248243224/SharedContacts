using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.IService;
using SC.Model.Entity;

namespace SC.Dal.Service
{
    public class MessageRecordService : IMessageRecordService
    {
        public async void AddAsync(int userId, int friendId, string content)
        {
            using (var context = SCContext.NewInstance)
            {
                var found = context.MessageRecords.Where(m => m.UserId.Equals(userId) && m.FriendId.Equals(friendId)).OrderByDescending(m => m.CreateTime).FirstOrDefault();
                if (found != null && found.CreateTime.DayOfYear == DateTime.Now.DayOfYear) found.Content += $"<{userId}>{content}";
                else
                {
                    var messageRecord = new MessageRecord()
                    {
                        Content = $"<{userId}>{content}",
                        CreateTime = DateTime.Now,
                        FriendId = friendId,
                        UserId = userId
                    };
                    context.MessageRecords.Add(messageRecord);
                }
                await context.SaveChangesAsync();
            }
        }
    }
}
