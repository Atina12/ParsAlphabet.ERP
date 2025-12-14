using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionDentalAdverseReactionLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public int? ReactionId { get; set; }

    public int? ReactionCategoryId { get; set; }

    /// <summary>
    /// thrOrdinalTerm
    /// </summary>
    public byte? DiagnosisSeverityId { get; set; }

    public string Description { get; set; }

    public short? CausativeAgentId { get; set; }

    public short? CausativeAgentCategoryId { get; set; }
}
