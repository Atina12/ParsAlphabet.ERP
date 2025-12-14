using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.FM.VAT;

[DisplayName("VAT")]
public class VATModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Display(Name = "درصد مالیات")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [RegularExpression(@"^(?:100|[1-9]?[0-9])$", ErrorMessage = "{0} باید کوچکتر یا مساوی 100 باشد")]
    public byte VATPer { get; set; }

    public bool IsActive { get; set; }

    [Display(Name = "گروه تفضیل")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    public short NoSeriesId { get; set; }

    [Display(Name = "کد تفضیل")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    public int AccountDetailId { get; set; }

    [Display(Name = "نوع مالیات")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    public byte VATTypeId { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}