using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class WorkingHourTypeLineDetail
{
    public byte Id { get; set; }

    public byte? WorkingHourTypeLineId { get; set; }

    public byte? WorkingOperatorId { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public short? Duration { get; set; }
}
