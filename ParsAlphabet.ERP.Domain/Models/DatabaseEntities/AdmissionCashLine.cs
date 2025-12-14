using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionCashLine
{
    public long Id { get; set; }

    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public byte InOut { get; set; }

    public byte FundTypeId { get; set; }

    public byte? CurrencyId { get; set; }

    public decimal? ExchangeRate { get; set; }

    public decimal? Amount { get; set; }

    public string AccountNo { get; set; }

    public string RefNo { get; set; }

    public string CardNo { get; set; }

    public string TerminalNo { get; set; }

    public short? PosId { get; set; }

    public int? DetailAccountId { get; set; }

    public int? UserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
