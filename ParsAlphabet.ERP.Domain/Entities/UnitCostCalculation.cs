using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class UnitCostCalculation
{
    public byte Id { get; set; }

    public short? FiscalYearId { get; set; }

    public byte? CostingMethodId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
