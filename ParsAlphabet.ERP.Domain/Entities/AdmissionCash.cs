using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionCash
{
    public int Id { get; set; }

    public int? AdmissionMasterId { get; set; }

    public short? StageId { get; set; }

    public byte? ActionId { get; set; }

    public int? WorkflowId { get; set; }

    public short? BranchId { get; set; }

    public decimal? CashAmount { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public int? CompanyId { get; set; }

    public DateTime? ModifyDateTime { get; set; }

    public int? ModifyUserId { get; set; }
}
