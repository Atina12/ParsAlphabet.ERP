using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class Journal
{
    public int Id { get; set; }

    public short? BranchId { get; set; }

    public short? StageId { get; set; }

    public short DocumentNo { get; set; }

    public byte DocumentTypeId { get; set; }

    public DateOnly DocumentDate { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public int? ModifiedUserId { get; set; }

    public DateTime? ModifiedDateTime { get; set; }

    public bool BySystem { get; set; }

    public byte? ActionId { get; set; }

    public byte? CompanyId { get; set; }

    public int? WorkflowId { get; set; }

    public decimal? AmountDebit { get; set; }

    public decimal? AmountCredit { get; set; }

    public int? ParentWorkflowCategoryId { get; set; }
}
