using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionClose;

public class AdmissionCloseModel : CompanyViewModel
{
    public string Opr => Id == 0 ? "Ins" : "Upd";
    public int Id { get; set; }
    public short WorkDayId { get; set; }
    public DateTime? CreateDatetime { get; set; }

    public string CreateDatetimePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();
            CreateDatetime = str == null ? null : str.Value;
        }
    }

    [Display(Name = "نام شعبه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public short BranchId { get; set; }

    public DateTime? CloseDateTime { get; set; }

    public string CloseDateTimePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();
            CloseDateTime = str == null ? null : str.Value;
        }
    }

    public int UserId { get; set; }
    public int DocNo { get; set; }
}