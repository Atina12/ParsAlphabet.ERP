using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class CostCenterLine
{
    public int Id { get; set; }

    public short HeaderId { get; set; }

    public byte? AllocationPercentage { get; set; }

    public int CompanyId { get; set; }

    public short? StageId { get; set; }

    public short? ItemCategoryId { get; set; }

    public short? CostRelationId { get; set; }
}
