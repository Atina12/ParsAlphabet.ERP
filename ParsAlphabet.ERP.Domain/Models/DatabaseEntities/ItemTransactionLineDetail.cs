using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ItemTransactionLineDetail
{
    public int ItemTransactionLineId { get; set; }

    public int? ItemId { get; set; }

    public short? UnitId { get; set; }

    public short? SubUnitId { get; set; }

    public decimal? Ratio { get; set; }

    public decimal? TotalQuantity { get; set; }

    public string AttributeIds { get; set; }
}
