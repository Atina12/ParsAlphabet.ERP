using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class UnitCostCalculationLineDetail
{
    public short Id { get; set; }

    public byte? UnitCostCalculationLineId { get; set; }

    public byte? MonthId { get; set; }

    public byte? ActionId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
