using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionDentalToothLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public bool? IsMissing { get; set; }

    public short? PartId { get; set; }

    public int? SegmentId { get; set; }

    public string Comment { get; set; }

    public short? ToothId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
