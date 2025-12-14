using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.FM.TreasurySubject;

[DisplayName("TreasurySubject")]
public class TreasurySubjectModel : CompanyViewModel
{
    public bool IsSecondLang { get; set; }
    public short Id { get; set; }

    [Display(Name = "موضوع خزانه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Display(Name = "طبقه بندی گردش وجوه")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte CashFlowCategoryId { get; set; }

    public bool IsActive { get; set; }

    public List<ID> StageIdList { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}