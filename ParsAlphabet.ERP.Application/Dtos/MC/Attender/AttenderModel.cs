using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Attender;

[DisplayName("Attender")]
public class AttenderModel : CompanyViewModel
{
    public int Id { get; set; }

    public int? CentralId { get; set; }

    public int? ExternalCentralId { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string FirstName { get; set; }

    [Display(Name = " تخلص")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string LastName { get; set; }

    [Display(Name = "نام پدر")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string FatherName { get; set; }

    [Display(Name = "شماره موبایل")]
    [StringLength(10, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string MobileNo { get; set; }

    [Display(Name = "شماره تلفن")]
    [StringLength(10, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string PhoneNo { get; set; }

    [Display(Name = "شماره شناسنامه")]
    //[Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(10, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string IdNumber { get; set; }

    [Display(Name = "جنسیت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public int GenderId { get; set; }

    [Display(Name = "نمبر تذکره")]
    [AfghanTazkira(ErrorMessage = "{0} معتبر نمی باشد")]
    public string NationalCode { get; set; }

    [Display(Name = "شماره نظام پزشکی")]
   // [StringLength(10, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string MSC { get; set; }

    [Display(Name = "نوع نظام پزشکی")]
    //[Required(ErrorMessage = "{0} را انتخاب کنید")]
   // [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte MSC_TypeId { get; set; }

    public DateTime? MSC_ExpDate { get; set; }

    public string MSC_ExpDatePersian
    {
        get => MSC_ExpDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            MSC_ExpDate = str == null ? null : str.Value;
        }
    }

    public DateTime? BirthDate { get; set; }

    public string BirthDatePersian
    {
        get => BirthDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            BirthDate = str == null ? null : str.Value;
        }
    }

    public string Address { get; set; }
    public short? LocStateId { get; set; }
    public int? LocCityId { get; set; }
    public short? SpecialityId { get; set; }
    public byte? RoleId { get; set; }
    public int DepartmentId { get; set; }

    [Display(Name = "درصد مالیات")]
   // [Required(ErrorMessage = "{0} را وارد کنید")]
    [Percentage(ErrorMessage = "{0} معتبر نمی باشد")]
    [Range(0, 99, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte AttenderTaxPer { get; set; }

    public bool IsActive { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";

    public string PrescriptionTypeId { get; set; }
    public bool AcceptableParaclinic { get; set; }

    public byte ContractType { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
}