using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class BalanceTreasury
{
    public long Id { get; set; }

    public int? WorkflowId { get; set; }

    public byte? WorkflowCategoryId { get; set; }

    public long IdentityId { get; set; }

    public short StageId { get; set; }

    public byte StageClassId { get; set; }

    public byte InOut { get; set; }

    public short BankId { get; set; }

    public byte BankAccountId { get; set; }

    public byte? CurrencyId { get; set; }

    public int ExchangeRate { get; set; }

    public long Amount { get; set; }

    public DateTime CreateDateTime { get; set; }

    public int CreateUserId { get; set; }
}
