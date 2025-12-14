using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class FiscalYear
{
    public short Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public bool? Closed { get; set; }

    public byte? CompanyId { get; set; }
}
