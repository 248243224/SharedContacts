using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SC.IService;
using SC.Model.Entity;
using SC.Dal;
using System.IO;
using SC.Common;

namespace SC.Dal.Service
{
    public class AttachmentService : IAttachmentService
    {
        public FileStream Get(string url)
        {
            string fileLocation = Path.Combine(SCEnvironment.AttchmentRootFolder, url);
            var stream = new FileStream(fileLocation, FileMode.Open, FileAccess.Read);
            return stream;
        }
    }
}
