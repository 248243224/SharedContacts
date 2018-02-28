using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SC.Model
{
    public class JqTableData<T> where T : class
    {
        /// <summary>
        /// 请求服务器端次数
        /// </summary>
        public string sEcho { get; set; }
        /// <summary>
        /// 总记录数
        /// </summary>
        public int iTotalRecords { get; set; }

        /// <summary>
        /// 过滤后的总记录数
        /// </summary>
        public int iTotalDisplayRecords { get; set; }
        /// <summary>
        /// 数据列表
        /// </summary>
        public ICollection<T> aaData { get; set; }
    }
}