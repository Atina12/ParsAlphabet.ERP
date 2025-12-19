using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class EliminateHidreason
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public bool? IsAdm { get; set; }
}
