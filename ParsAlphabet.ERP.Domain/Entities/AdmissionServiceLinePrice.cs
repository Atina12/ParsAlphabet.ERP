using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionServiceLinePrice
{
    public byte? AttenderCommissionType { get; set; }

    public decimal? AttenderCommissionValue { get; set; }

    public decimal? AttenderCommissionAmount { get; set; }

    public byte? AttenderTaxPercentage { get; set; }

    public decimal? BasicPrice { get; set; }

    public decimal? BasicServicePrice { get; set; }

    public byte? BasicPercentage { get; set; }

    public byte? BasicCalculationMethodId { get; set; }

    public decimal? CompPrice { get; set; }

    public decimal? CompServicePrice { get; set; }

    public byte? CompPercentage { get; set; }

    public byte? CompCalculationMethodId { get; set; }

    public decimal? ThirdPartyPrice { get; set; }

    public decimal? ThirdPartyServicePrice { get; set; }

    public byte? ThirdPartyPercentage { get; set; }

    public byte? ThirdPartyCalculationMethodId { get; set; }

    public decimal? DiscountPrice { get; set; }

    public decimal? DiscountServicePrice { get; set; }

    public byte? DiscountPercentage { get; set; }

    public byte? DiscountCalculationMethodId { get; set; }

    public long AdmissionServiceLineId { get; set; }
}
