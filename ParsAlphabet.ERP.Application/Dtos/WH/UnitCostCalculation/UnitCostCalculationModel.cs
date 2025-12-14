using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.WH.UnitCostCalculation;

[DisplayName("UnitCostCalculation")]
public class UnitCostCalculationModel : CompanyViewModel
{
    public DateTime CreateDateTime = DateTime.Now;
    public byte Id { get; set; }

    [Display(Name = "سال مالی")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public int FiscalYearId { get; set; }

    public short BranchId { get; set; }
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public byte CostingMethodId { get; set; }
    public int CreateUserId { get; set; }

    public string CreateDateTimePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();

            CreateDateTime = str.Value;
        }
    }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}