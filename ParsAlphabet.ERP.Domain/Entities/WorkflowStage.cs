using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class WorkflowStage
{
    public int Id { get; set; }

    public int? WorkflowId { get; set; }

    public short? StageId { get; set; }

    public string HeaderTableName { get; set; }

    public string LineTableName { get; set; }

    public byte? AdmissionTypeId { get; set; }
}
