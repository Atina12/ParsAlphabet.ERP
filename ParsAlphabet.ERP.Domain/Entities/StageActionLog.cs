using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class StageActionLog
{
    public long Id { get; set; }

    public long? TransactionId { get; set; }

    public byte? WorkflowCategoryId { get; set; }

    public short? StageId { get; set; }

    public byte? ActionId { get; set; }

    public int? UserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CompanyId { get; set; }

    public int? WorkflowId { get; set; }
}
