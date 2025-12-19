using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PrescriptionLabLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public int? ServiceId { get; set; }

    public bool? DoNotPerform { get; set; }

    public short? AsNeedId { get; set; }

    public int? ReasonId { get; set; }

    public short? BodySiteId { get; set; }

    public string Note { get; set; }

    public string PatientInstruction { get; set; }
}
