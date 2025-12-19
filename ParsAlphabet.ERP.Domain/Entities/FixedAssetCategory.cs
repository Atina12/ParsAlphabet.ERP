using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class FixedAssetCategory
{
    public short Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public byte? CompanyId { get; set; }
}
