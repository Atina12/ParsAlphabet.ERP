using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionReferClinicFindingLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public decimal? AgeOfOnset { get; set; }

    public bool? NillSignificant { get; set; }

    public decimal? OnsetDurationToPresent { get; set; }

    public short? OnsetDurationToPresentUnitId { get; set; }

    /// <summary>
    /// thrICD
    /// </summary>
    public int? FindingId { get; set; }

    public byte? SeverityId { get; set; }

    public DateTime? OnsetDateTime { get; set; }

    public string Description { get; set; }
}
