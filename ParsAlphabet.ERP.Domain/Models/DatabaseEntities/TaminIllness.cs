using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TaminIllness
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public bool? IsActive { get; set; }
}
