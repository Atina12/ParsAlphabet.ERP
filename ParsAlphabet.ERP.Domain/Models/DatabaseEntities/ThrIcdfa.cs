using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ThrIcdfa
{
    public int Id { get; set; }

    public string Code { get; set; }

    public string Value { get; set; }

    public string Descript { get; set; }

    public bool? IsActive { get; set; }
}
