using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionReferDrugHistoryLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    /// <summary>
    /// thrFDOIR
    /// </summary>
    public short? MedicationId { get; set; }

    public short? RouteId { get; set; }
}
