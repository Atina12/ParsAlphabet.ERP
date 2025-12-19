using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ThrLifeCycle
{
    public byte Id { get; set; }

    public string Code { get; set; }

    public string Name { get; set; }

    public bool? IsActive { get; set; }
}
