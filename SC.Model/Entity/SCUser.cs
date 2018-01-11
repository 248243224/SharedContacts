using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SC.Model.Entity
{
    public class SCUser
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        [Required]
        [MaxLength(5, ErrorMessage = "姓名长度不能超过5")]
        public string Name { get; set; }

        public int? Sex { get; set; }
        [MaxLength(50, ErrorMessage = "头像路径长度不能超过50")]
        public string AvatarUrl { get; set; }

        public virtual List<RedPacket> RedPackets { get; set; }
    }
}
