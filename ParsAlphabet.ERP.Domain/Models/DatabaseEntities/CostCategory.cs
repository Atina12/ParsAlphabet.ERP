using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class CostCategory
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public int? CompanyId { get; set; }
}
