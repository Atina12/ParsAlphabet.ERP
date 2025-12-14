using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class HoliDay
{
    public short? Year { get; set; }

    public byte? Month { get; set; }

    public byte? Day { get; set; }
}
