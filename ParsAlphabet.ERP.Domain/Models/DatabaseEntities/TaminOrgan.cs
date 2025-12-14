using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TaminOrgan
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public byte? ParentId { get; set; }

    public bool? IsActive { get; set; }
}
