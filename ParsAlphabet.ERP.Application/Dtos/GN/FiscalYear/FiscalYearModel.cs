using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.GN.FiscalYear;

[DisplayName("FiscalYear")]
public class FiscalYearModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "عنوان دوره")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

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

    public bool Closed { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}