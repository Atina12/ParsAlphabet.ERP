using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class CostObject
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public byte? CostTypeId { get; set; }

    public bool? IsActiveAttender { get; set; }

    public bool? IsActiveEmployee { get; set; }

    public bool? IsActiveFixedAsset { get; set; }
}
