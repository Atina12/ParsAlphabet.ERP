using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class CustomerSalesPrice
{
    public int Id { get; set; }

    public byte ItemTypeId { get; set; }

    public short ItemId { get; set; }

    public byte CurrencyId { get; set; }

    public byte? PricingModelId { get; set; }

    public decimal? MinPrice { get; set; }

    public decimal? MaxPrice { get; set; }

    public bool? AllowInvoiceDisc { get; set; }

    public bool? PriceIncludingVat { get; set; }

    public short? ContractTypeId { get; set; }

    public byte? PriceTypeId { get; set; }

    public decimal? ComissionPrice { get; set; }

    public int? VendorId { get; set; }

    public byte? CompanyId { get; set; }

    public bool? IsActive { get; set; }
}
