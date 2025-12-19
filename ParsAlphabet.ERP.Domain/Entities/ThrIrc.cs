using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ThrIrc
{
    public short Id { get; set; }

    public string Code { get; set; }

    public string Value { get; set; }

    public bool? IsActive { get; set; }
}
