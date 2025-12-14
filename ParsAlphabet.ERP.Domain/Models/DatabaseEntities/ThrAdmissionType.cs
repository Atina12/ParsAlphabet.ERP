using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ThrAdmissionType
{
    public short Id { get; set; }

    public string Code { get; set; }

    public string Name { get; set; }

    public bool? IsActive { get; set; }
}
