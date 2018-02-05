using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SC.IService
{
    public interface IAttachmentService
    {
        FileStream GetFileStream(string url);
        string GetFileString(string url);
    }
}
