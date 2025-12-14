using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class WorkflowBranch
{
    public int Id { get; set; }

    public short? BranchId { get; set; }

    public int? WorkflowId { get; set; }
}
