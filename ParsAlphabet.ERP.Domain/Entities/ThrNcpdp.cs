using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ThrNcpdp
{
    public short Id { get; set; }

    public string Code { get; set; }

    public string Name { get; set; }

    public bool? IsActive { get; set; }
}
