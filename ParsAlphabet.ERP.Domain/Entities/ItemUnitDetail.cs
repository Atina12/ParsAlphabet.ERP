using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ItemUnitDetail
{
    public short Id { get; set; }

    public int? ItemId { get; set; }

    public short? UnitId { get; set; }

    public short? SubUnitId { get; set; }

    public decimal? Ratio { get; set; }
}
