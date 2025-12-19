using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class DayInWeek
{
    public DateOnly JulianDate { get; set; }

    public string PersianDate { get; set; }

    public byte? DayInWeek1 { get; set; }
}
