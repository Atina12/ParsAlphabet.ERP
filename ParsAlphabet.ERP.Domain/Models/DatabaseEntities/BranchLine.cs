using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class BranchLine
{
    public int Id { get; set; }

    public short? HeaderId { get; set; }

    public byte? BranchLineTypeId { get; set; }

    public string Value { get; set; }
}
