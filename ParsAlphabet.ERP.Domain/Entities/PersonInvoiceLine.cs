using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PersonInvoiceLine
{
    public int HeaderId { get; set; }

    public short RowNumber { get; set; }

    public byte? ItemTypeId { get; set; }

    public int? ItemId { get; set; }

    public short? Quantity { get; set; }

    public decimal? Price { get; set; }

    public short? VatId { get; set; }

    public byte? VatPer { get; set; }

    public bool? PriceIncludingVat { get; set; }

    public decimal? ExchangeRate { get; set; }

    public decimal? DiscountPer { get; set; }

    public bool? AllowInvoiceDisc { get; set; }

    public decimal? DiscountAmount { get; set; }

    public DateTime? ConfirmDateTime { get; set; }

    public int? ConfirmUserId { get; set; }
}
