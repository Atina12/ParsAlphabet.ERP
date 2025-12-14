using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AccountSglcurrency
{
    public int AccountGlid { get; set; }

    public int AccountSglid { get; set; }

    public int CurrencyId { get; set; }

    public int CompanyId { get; set; }
}
