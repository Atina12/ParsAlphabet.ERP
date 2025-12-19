using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class TaminServiceGroup
{
    public int Id { get; set; }

    public string Name { get; set; }

    public bool? IsActive { get; set; }
}
