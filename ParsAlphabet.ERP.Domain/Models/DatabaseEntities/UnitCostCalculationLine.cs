using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class UnitCostCalculationLine
{
    public int Id { get; set; }

    public byte? HeaderId { get; set; }

    public short? BranchId { get; set; }

    public int? WorkflowId { get; set; }

    public short? StageId { get; set; }
}
