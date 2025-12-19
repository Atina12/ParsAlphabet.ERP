using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ThrArrivalMode
{
    public string Id { get; set; }

    public string Name { get; set; }

    public bool? IsActive { get; set; }
}
