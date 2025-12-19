using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionCloseLine
{
    public int Id { get; set; }

    public int? HeaderId { get; set; }

    public int? LineId { get; set; }

    public int? AdmissionUserId { get; set; }

    public byte? InOut { get; set; }

    public byte? FundTypeId { get; set; }

    public int? DetailAccountId { get; set; }

    public decimal? Amount { get; set; }

    public decimal? DecimalAmount { get; set; }

    public decimal? ExchangeRate { get; set; }

    public byte? CurrencyId { get; set; }
}
