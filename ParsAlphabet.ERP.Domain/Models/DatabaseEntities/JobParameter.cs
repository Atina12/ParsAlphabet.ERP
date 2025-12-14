using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class JobParameter
{
    public long JobId { get; set; }

    public string Name { get; set; }

    public string Value { get; set; }
}
