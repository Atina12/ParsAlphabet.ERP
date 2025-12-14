using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ThrHq
{
    public short Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public short? HqstypeId { get; set; }

    public bool? IsActive { get; set; }
}
