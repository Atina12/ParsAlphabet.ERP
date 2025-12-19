using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class CostRelation
{
    public short Id { get; set; }

    public byte? ItemTypeId { get; set; }

    public byte? CostObjectId { get; set; }

    public bool? IsAllocated { get; set; }

    public bool? IsActive { get; set; }
}
