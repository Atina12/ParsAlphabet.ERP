using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class StageStepConfig
{
    public int Id { get; set; }

    public short? StageId { get; set; }

    public int? WorkflowId { get; set; }
}
