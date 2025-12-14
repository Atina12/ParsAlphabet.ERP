using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class DocumentAccountHeader
{
    public int Id { get; set; }

    public int? TreasuryId { get; set; }

    public int? TreasuryLineId { get; set; }

    public int? PreviousTreasuryLineId { get; set; }
}
