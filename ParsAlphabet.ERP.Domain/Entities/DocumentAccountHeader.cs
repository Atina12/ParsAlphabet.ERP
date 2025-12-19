using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class DocumentAccountHeader
{
    public int Id { get; set; }

    public int? TreasuryId { get; set; }

    public int? TreasuryLineId { get; set; }

    public int? PreviousTreasuryLineId { get; set; }
}
