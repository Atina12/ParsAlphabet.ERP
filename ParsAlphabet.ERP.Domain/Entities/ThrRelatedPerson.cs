using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ThrRelatedPerson
{
    public int Id { get; set; }

    public byte? Code { get; set; }

    public string Name { get; set; }

    public bool? IsActive { get; set; }
}
