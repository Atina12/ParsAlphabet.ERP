using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionReferMedicalHistoryLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    /// <summary>
    /// thrICD
    /// </summary>
    public int? ConditionId { get; set; }

    public decimal? OnsetDurationToPresent { get; set; }

    public short? OnsetDurationToPresentUnitId { get; set; }

    public string Description { get; set; }

    public DateTime? DateOfOnset { get; set; }

    public byte? AgeOfOnset { get; set; }
}
