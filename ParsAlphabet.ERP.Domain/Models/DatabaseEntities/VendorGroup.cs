using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class VendorGroup
{
    public short Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public int? CompanyId { get; set; }

    public bool? IsActive { get; set; }
}
