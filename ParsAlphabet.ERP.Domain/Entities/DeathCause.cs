using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class DeathCause
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public int? CauseId { get; set; }

    public byte? StatusId { get; set; }

    public decimal? DurationDeath { get; set; }

    public short? DurationDeathUnitId { get; set; }
}
