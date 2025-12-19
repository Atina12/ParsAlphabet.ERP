using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class SaleOrderLine
{
    public int Id { get; set; }

    public int HeaderId { get; set; }

    public short? BranchId { get; set; }

    public byte? ItemTypeId { get; set; }

    public byte? InOut { get; set; }

    public int? ItemId { get; set; }

    public byte? CurrencyId { get; set; }

    public decimal? Quantity { get; set; }

    public decimal? Price { get; set; }

    public decimal? ExchangeRate { get; set; }

    public decimal? GrossAmount { get; set; }

    public decimal? DiscountValue { get; set; }

    public byte? DiscountType { get; set; }

    public decimal? DiscountAmount { get; set; }

    public decimal? NetAmount { get; set; }

    public short? VatId { get; set; }

    public byte? Vatper { get; set; }

    public decimal? Vatamount { get; set; }

    public decimal? FinalAmount { get; set; }

    public bool? AllowInvoiceDiscount { get; set; }

    public bool PriceIncludingVat { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
