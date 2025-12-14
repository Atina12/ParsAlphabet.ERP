using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TaminDrugUsage
{
    public int Id { get; set; }

    public string Code { get; set; }

    public string Summary { get; set; }

    public string LatinName { get; set; }

    public string Concept { get; set; }

    public bool? IsActive { get; set; }
}
