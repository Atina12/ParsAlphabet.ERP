using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.WH.UnitCostCalculationLine;

[DisplayName("UnitCostCalculationLine")]
public class UnitCostCalculationLineModel
{
    public DateTime CreateDateTime = DateTime.Now;
    public byte Id { get; set; }

    public int HeaderId { get; set; }
    public short MonthId { get; set; }
    public byte ActionId { get; set; }
    public int CreateUserId { get; set; }

    [NotMapped] public string TableName { get; set; }
}