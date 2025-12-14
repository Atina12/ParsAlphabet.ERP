using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class Hash
{
    public string Key { get; set; }

    public string Field { get; set; }

    public string Value { get; set; }

    public DateTime? ExpireAt { get; set; }
}
