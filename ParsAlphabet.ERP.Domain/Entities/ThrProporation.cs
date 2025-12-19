using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ThrProporation
{
    public short Id { get; set; }

    public string Name { get; set; }

    public bool? IsActive { get; set; }
}
