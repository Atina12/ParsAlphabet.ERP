using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ItemAttributeLine
{
    public short Id { get; set; }

    public short? ItemAttributeId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
