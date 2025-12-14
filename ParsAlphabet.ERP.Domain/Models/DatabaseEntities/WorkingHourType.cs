using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class WorkingHourType
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public byte? InOut { get; set; }

    public bool? IsActive { get; set; }
}
