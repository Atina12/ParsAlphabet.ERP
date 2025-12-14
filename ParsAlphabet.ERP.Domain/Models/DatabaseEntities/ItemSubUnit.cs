using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ItemSubUnit
{
    public short HeaderId { get; set; }

    public short UnitId { get; set; }

    public decimal Ratio { get; set; }

    public bool? IsActive { get; set; }
}
