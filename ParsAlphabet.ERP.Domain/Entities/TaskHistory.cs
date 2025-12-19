using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class TaskHistory
{
    public long Id { get; set; }

    public string TaskService { get; set; }

    public int? NumberAttempts { get; set; }

    public string GeneratedKey { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CompanyId { get; set; }

    public string Description { get; set; }
}
