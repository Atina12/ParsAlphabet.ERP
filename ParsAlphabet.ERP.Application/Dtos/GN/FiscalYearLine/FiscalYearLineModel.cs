using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.GN.FiscalYearLine;

public class FiscalYearLineModel
{
    public int Id { get; set; }
    public byte HeaderId { get; set; }

    [Display(Name = "ماه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte MonthId { get; set; }

    [Display(Name = "نام ماه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string MonthName { get; set; }

    public DateTime StartDate { get; set; }

    public string StartDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();
            StartDate = str.Value;
        }
    }

    public DateTime EndDate { get; set; }

    public string EndDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();
            EndDate = str.Value;
        }
    }

    public bool Locked { get; set; }
}