using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ThrFdoir
{
    public int Id { get; set; }

    public short? Code { get; set; }

    public string Name { get; set; }

    public bool? IsActive { get; set; }
}
