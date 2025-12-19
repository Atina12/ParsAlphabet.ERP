using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionReferalFamilyHisotryLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    /// <summary>
    /// thrICD
    /// </summary>
    public int? ConditionId { get; set; }

    public byte? RelatedPersonId { get; set; }

    public bool? IsCauseofDeath { get; set; }

    public string Description { get; set; }
}
