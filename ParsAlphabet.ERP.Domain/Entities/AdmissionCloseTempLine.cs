using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionCloseTempLine
{
    public int Id { get; set; }

    public int HeaderId { get; set; }

    public int UserId { get; set; }

    public byte FundTypeId { get; set; }

    public int? DetailAccountId { get; set; }

    public decimal? Amount { get; set; }

    public byte? InOut { get; set; }

    public decimal? ExchangeRate { get; set; }

    public byte? CurrencyId { get; set; }
}
