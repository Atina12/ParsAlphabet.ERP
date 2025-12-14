using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class Counter
{
    public string Key { get; set; }

    public int Value { get; set; }

    public DateTime? ExpireAt { get; set; }

    public long Id { get; set; }
}
