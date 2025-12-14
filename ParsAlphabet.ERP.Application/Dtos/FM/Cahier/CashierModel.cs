using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ParsAlphabet.ERP.Application.Dtos.FM.Pos;

namespace ParsAlphabet.ERP.Application.Dtos.FM.Cahier;

[DisplayName("Cashier")]
public class CashierModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    public short BranchId { get; set; }

    public bool IsActive { get; set; }
    public bool IsStand { get; set; }

    [Display(Name = "آی پی سیستم صندوق")]
    [IPv4(ErrorMessage = "{0} معتبر نمی باشد")]
    public string IpAddress { get; set; }

    public List<PosModel> PosList { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}