using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class State
{
    public long Id { get; set; }

    public long JobId { get; set; }

    public string Name { get; set; }

    public string Reason { get; set; }

    public DateTime CreatedAt { get; set; }

    public string Data { get; set; }
}
