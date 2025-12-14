using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ThrSpecialty
{
    public short Id { get; set; }

    public int Code { get; set; }

    public string Name { get; set; }

    public bool? IsActive { get; set; }
}
