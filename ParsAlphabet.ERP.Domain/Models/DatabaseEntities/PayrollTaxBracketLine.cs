using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class PayrollTaxBracketLine
{
    public short Id { get; set; }

    public short? HeaderId { get; set; }

    public byte? RowNumber { get; set; }

    public long? StartAmount { get; set; }

    public long? EndAmount { get; set; }

    public byte? TaxPercentage { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateuserId { get; set; }
}
