using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Job
{
    public long Id { get; set; }

    public long? StateId { get; set; }

    public string StateName { get; set; }

    public string InvocationData { get; set; }

    public string Arguments { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? ExpireAt { get; set; }
}
