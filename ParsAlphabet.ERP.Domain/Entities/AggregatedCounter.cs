using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AggregatedCounter
{
    public string Key { get; set; }

    public long Value { get; set; }

    public DateTime? ExpireAt { get; set; }
}
