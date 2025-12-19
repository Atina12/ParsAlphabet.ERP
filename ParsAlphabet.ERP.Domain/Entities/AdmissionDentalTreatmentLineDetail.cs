using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionDentalTreatmentLineDetail
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public byte DetailRowNumber { get; set; }

    public short? ServiceId { get; set; }

    public string ServiceTypeId { get; set; }

    public decimal? ServiceCount { get; set; }

    public short? ServiceCountUnitId { get; set; }

    public DateTime? StartDateTime { get; set; }

    public DateTime? EndDateTime { get; set; }
}
