using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.FM.AccountDetail;

[DisplayName("AccountDetail")]
public class AccountDetailModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short NoSeriesId { get; set; }

    [Display(Name = "تاریخ ثبت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [DataType(DataType.DateTime)]
    public DateTime CreateDateTime { get; set; } = DateTime.Now;

    [NotMapped] public string Opr { get; set; }

    public string DataJson { get; set; }
    public bool IsActive { get; set; }
}