using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ThrOrganization
{
    public byte Id { get; set; }

    public string Code { get; set; }

    public string Value { get; set; }

    public bool? IsActive { get; set; }
}
