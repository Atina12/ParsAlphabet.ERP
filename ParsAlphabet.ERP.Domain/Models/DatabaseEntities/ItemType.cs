using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ItemType
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public bool? IsActiveItem { get; set; }

    public bool? IsActiveSalesPrice { get; set; }
}
