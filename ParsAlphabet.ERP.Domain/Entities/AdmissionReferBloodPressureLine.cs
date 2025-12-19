using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionReferBloodPressureLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public decimal? SystolicBp { get; set; }

    public decimal? DiastolicBp { get; set; }

    public short? PositionId { get; set; }

    public DateTime? ObservationDateTime { get; set; }
}
