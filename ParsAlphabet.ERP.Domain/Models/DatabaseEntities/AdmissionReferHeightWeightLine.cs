using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionReferHeightWeightLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public decimal? Height { get; set; }

    public decimal? Weight { get; set; }

    public DateTime? ObservationDateTime { get; set; }
}
