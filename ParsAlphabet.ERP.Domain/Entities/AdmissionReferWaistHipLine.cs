using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionReferWaistHipLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public decimal? WaistCircumference { get; set; }

    public decimal? HipCircumference { get; set; }

    public DateTime? ObservationDateTime { get; set; }
}
