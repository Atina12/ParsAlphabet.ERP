using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class StageActionRelation
{
    public int Id { get; set; }

    public int? StageActionId { get; set; }

    public int? PreviousStageActionId { get; set; }

    public byte? WorkflowCategoryId { get; set; }

    public byte? PreviousWorkflowCategoryId { get; set; }
}
