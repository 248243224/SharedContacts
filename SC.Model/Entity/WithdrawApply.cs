using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SC.Model.Entity
{
    public class WithdrawApply
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ApplyId { get; set; }
        [Required]
        public double Amount { get; set; }
        public DateTime ApplyTime { get; set; }
        [ForeignKey("SCUser")]
        public int UserId { get; set; }

        public WithdrawApplyStatu Statu { get; set; }

        public virtual SCUser SCUser { get; set; }
    }

    public enum WithdrawApplyStatu
    {
        NotCompleted,
        Completed
    }
}
