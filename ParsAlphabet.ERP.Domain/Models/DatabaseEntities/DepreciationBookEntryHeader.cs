using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class DepreciationBookEntryHeader
{
    public int Id { get; set; }

    public byte? FiscalHeaderId { get; set; }

    public byte? MonthId { get; set; }
}
