using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class CompanyType
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public string EngName { get; set; }

    public bool? IsActive { get; set; }
}
