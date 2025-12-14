using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class SignalRgroup
{
    public short Id { get; set; }

    public string Name { get; set; }

    public string KeyId { get; set; }

    public bool? IsActive { get; set; }
}
