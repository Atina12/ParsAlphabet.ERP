using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AccountingPeriod
{
    public short Id { get; set; }

    public string Name { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public byte? CompanyId { get; set; }
}
