using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SC.Model.Entity
{
    public class MessageRecord
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MessageId { get; set; }
        public string Content { get; set; }
        public DateTime CreateTime { get; set; }
        [ForeignKey("SCUser")]
        public int UserId { get; set; }
        public virtual SCUser SCUser { get; set; }
    }
}
