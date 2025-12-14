using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TreasuryLine
{
    public long Id { get; set; }

    public long? HeaderId { get; set; }

    public byte? FundTypeId { get; set; }

    public byte? InOut { get; set; }

    public long? TreasuryLineDetailId { get; set; }

    public short? BankId { get; set; }

    public int? BankAccountId { get; set; }

    public long? TransitNo { get; set; }

    public long? DocumentNo { get; set; }

    public byte? CurrencyId { get; set; }

    public byte? Step { get; set; }

    public int? ExchangeRate { get; set; }

    public decimal? FinalAmount { get; set; }

    public bool? BankReport { get; set; }

    public byte? ActionId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
