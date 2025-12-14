using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AccountCategory
{
    public short Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public byte? IncomeBalanceId { get; set; }

    public byte? CompanyId { get; set; }

    public bool? IsActive { get; set; }
}
