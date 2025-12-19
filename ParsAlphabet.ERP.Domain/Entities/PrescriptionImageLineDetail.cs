using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PrescriptionImageLineDetail
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public byte DetailRowNumber { get; set; }

    public short? ServiceId { get; set; }

    public short? LateralityId { get; set; }
}
