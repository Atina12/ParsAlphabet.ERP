using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ItemTransactionLine
{
    public int Id { get; set; }

    public int HeaderId { get; set; }

    public short? CurrencyId { get; set; }

    public int RowNumber { get; set; }

    public short? ZoneId { get; set; }

    public short? BinId { get; set; }

    public byte? ItemTypeId { get; set; }

    public int? ItemId { get; set; }

    public byte? InOut { get; set; }

    public decimal? Quantity { get; set; }

    public decimal? Price { get; set; }

    public int? ExchangeRate { get; set; }

    public decimal? FinalAmount { get; set; }

    public decimal? BalanceQuantity { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }
}
