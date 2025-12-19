using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class TreasurySubjectLine
{
    public int Id { get; set; }

    public int? TreasurySubjectId { get; set; }

    public short? StageId { get; set; }
}
