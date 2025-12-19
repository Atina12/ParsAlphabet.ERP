using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class FixedAssetSubClass
{
    public short Id { get; set; }

    public byte? FixedAssetClassId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }
}
