using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ThrIcdo3
{
    public int Id { get; set; }

    public string Code { get; set; }

    public string Name { get; set; }

    public bool? IsMorphology { get; set; }

    public bool? IsTopography { get; set; }

    public bool? IsActive { get; set; }
}
