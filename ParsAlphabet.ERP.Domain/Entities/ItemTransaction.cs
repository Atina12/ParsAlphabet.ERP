using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ItemTransaction
{
    public int Id { get; set; }

    public int? ParentWorkflowCategoryId { get; set; }

    public int? RequestId { get; set; }

    public short? BranchId { get; set; }

    public int? WorkflowId { get; set; }

    public short? StageId { get; set; }

    public int? WarehouseId { get; set; }

    public int? TreasurySubjectId { get; set; }

    public int? JournalId { get; set; }

    public int? No { get; set; }

    public DateOnly? DocumentDate { get; set; }

    public byte? ActionId { get; set; }

    public byte? DocumentTypeId { get; set; }

    public int? AccountGlid { get; set; }

    public int? AccountSglid { get; set; }

    public int? NoSeriesId { get; set; }

    public int? AccountDetailId { get; set; }

    public byte? InOut { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public string Note { get; set; }

    public bool? BySystem { get; set; }

    public decimal? SumQuantity { get; set; }

    public decimal? SumAmount { get; set; }

    public byte? CompanyId { get; set; }
}
