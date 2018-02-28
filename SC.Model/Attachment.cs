using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SC.Model.Entity
{
    public class Attachment
    {
        public DateTime CreateTime { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public int? Size { get; set; }
        public string FileType { get; set; }
        public AttachmentCategory Category { get; set; }
    }

    public enum AttachmentCategory
    {
        RedPacketImg,
        AvatarImg
    }
}
