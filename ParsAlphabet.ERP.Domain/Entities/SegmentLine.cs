using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class SegmentLine
{
    public int Id { get; set; }

    public int HeaderId { get; set; }

    public byte? PersonGroupType { get; set; }

    public int? PersonId { get; set; }
}
