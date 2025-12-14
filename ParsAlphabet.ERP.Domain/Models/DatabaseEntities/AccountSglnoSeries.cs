using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AccountSglnoSeries
{
    public int AccountGlid { get; set; }

    public int AccountSglid { get; set; }

    public short NoSeriesId { get; set; }

    public int CompanyId { get; set; }
}
