using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class BundleLine
{
    public int Id { get; set; }

    public short? HeaderId { get; set; }

    public int? ItemId { get; set; }

    public short? ItemUnitId { get; set; }

    public short? ItemSubUnitId { get; set; }

    public decimal? Ratio { get; set; }

    public string AttributeIds { get; set; }

    public byte? ItemTypeId { get; set; }

    public int? Qty { get; set; }

    public decimal? QtyFinal { get; set; }
}
