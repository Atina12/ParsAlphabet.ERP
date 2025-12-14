using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class FinancialStep
{
    public int Id { get; set; }

    public int? IdentityId { get; set; }

    public short? StageId { get; set; }

    public int? UserId { get; set; }

    public short? StepId { get; set; }

    public DateTime? StepDateTime { get; set; }
}
