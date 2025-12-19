using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class TeethNumber
{
    public short FdiId { get; set; }

    public byte TeethNumberSystemId { get; set; }

    public string TeethNumber1 { get; set; }
}
