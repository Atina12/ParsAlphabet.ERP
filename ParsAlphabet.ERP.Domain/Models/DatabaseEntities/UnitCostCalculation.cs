using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class UnitCostCalculation
{
    public byte Id { get; set; }

    public short? FiscalYearId { get; set; }

    public byte? CostingMethodId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
