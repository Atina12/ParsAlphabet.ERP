using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class JournalLine
{
    public int Id { get; set; }

    public int HeaderId { get; set; }

    public int RowNumber { get; set; }

    public int? AccountGlid { get; set; }

    public int? AccountSglid { get; set; }

    public short? NoSeriesId { get; set; }

    public int? AccountDetailId { get; set; }

    public string Description { get; set; }

    public decimal? Amount { get; set; }

    public long? ExchangeRate { get; set; }

    public byte? NatureTypeId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? ModifiedDateTime { get; set; }

    public int? ModifiedUserId { get; set; }

    public byte? CurrencyId { get; set; }
}
