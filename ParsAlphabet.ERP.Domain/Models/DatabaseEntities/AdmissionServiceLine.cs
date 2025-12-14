using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionServiceLine
{
    public long Id { get; set; }

    public int HeaderId { get; set; }

    public int ServiceId { get; set; }

    public byte? Qty { get; set; }

    public decimal? BasicShareAmount { get; set; }

    public decimal? CompShareAmount { get; set; }

    public decimal? ThirdPartyAmount { get; set; }

    public decimal? DiscountAmount { get; set; }

    public decimal? PatientShareAmount { get; set; }

    public decimal? NetAmount { get; set; }

    public decimal? PenaltyAmount { get; set; }

    public decimal? RemainedAmount { get; set; }

    public byte? PenaltyId { get; set; }

    public byte? HealthInsuranceClaim { get; set; }

    // 🔹 Navigations
    public AdmissionService AdmissionService { get; set; }
    public Service Service { get; set; }
}
