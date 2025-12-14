using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionSaleLinePrice
{
    public long AdmissionSaleLineId { get; set; }

    public short? ContractTypeId { get; set; }

    public byte? PriceTypeId { get; set; }

    public decimal? VendorCommissionAmount { get; set; }

    public int? VendorId { get; set; }

    public decimal? BasicPrice { get; set; }

    public decimal? BasicItemPrice { get; set; }

    public byte? BasicPercentage { get; set; }

    public byte? BasicCalculationMethodId { get; set; }

    public decimal? CompPrice { get; set; }

    public decimal? CompItemPrice { get; set; }

    public byte? CompPercentage { get; set; }

    public byte? CompCalculationMethodId { get; set; }

    public decimal? ThirdPartyPrice { get; set; }

    public decimal? ThirdPartyItemPrice { get; set; }

    public byte? ThirdPartyPercentage { get; set; }

    public byte? ThirdPartyCalculationMethodId { get; set; }

    public decimal? DiscountPrice { get; set; }

    public decimal? DiscountItemPrice { get; set; }

    public byte? DiscountPercentage { get; set; }

    public byte? DiscountCalculationMethodId { get; set; }

    public byte? Vatpercentage { get; set; }
}
