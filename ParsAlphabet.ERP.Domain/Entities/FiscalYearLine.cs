using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class FiscalYearLine
{
    public int Id { get; set; }

    public short HeaderId { get; set; }

    public byte MonthId { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public bool? Locked { get; set; }
}
