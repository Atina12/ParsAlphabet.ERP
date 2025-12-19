using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionSaleLine
{
    public long Id { get; set; }

    public int HeaderId { get; set; }

    public int ItemId { get; set; }

    public string AttributeIds { get; set; }

    public short? Qty { get; set; }

    public decimal? DiscountAmount { get; set; }

    public decimal? BasicShareAmount { get; set; }

    public decimal? CompShareAmount { get; set; }

    public decimal? ThirdPartyAmount { get; set; }

    public decimal? PatientShareAmount { get; set; }

    public decimal? NetAmount { get; set; }
}
