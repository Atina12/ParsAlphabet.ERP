using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TaskScheduleHistory
{
    public long Id { get; set; }

    public string TaskTitle { get; set; }

    public string TaskDescription { get; set; }

    public string TaskResult { get; set; }

    public DateTime? TaskDateTime { get; set; }

    public int? CompanyId { get; set; }
}
