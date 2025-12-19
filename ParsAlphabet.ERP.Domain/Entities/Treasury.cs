using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Treasury
{
    public long Id { get; set; }

    public long? RequestId { get; set; }

    public short? BranchId { get; set; }

    public DateTime CreateDateTime { get; set; }

    public int? No { get; set; }

    public long? JournalId { get; set; }

    public int? TreasurySubjectId { get; set; }

    public byte? DocumentTypeId { get; set; }

    public string Note { get; set; }

    public int? CompanyId { get; set; }

    public int? WorkflowId { get; set; }

    public bool? CreateBySystem { get; set; }

    public short StageId { get; set; }

    public long? AccountGlid { get; set; }

    public long? AccountSglid { get; set; }

    public short? NoSeriesId { get; set; }

    public int? AccountDetailId { get; set; }

    public byte? InOut { get; set; }

    public DateOnly? DocumentDate { get; set; }

    public byte? ActionId { get; set; }

    public int CreateUserId { get; set; }

    public int? ParentWorkflowCategoryId { get; set; }
}
