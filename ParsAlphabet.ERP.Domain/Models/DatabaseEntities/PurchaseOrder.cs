using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class PurchaseOrder
{
    public int Id { get; set; }

    public int? ParentWorkflowCategoryId { get; set; }

    public int? RequestId { get; set; }

    public int? CompanyId { get; set; }

    public short BranchId { get; set; }

    public int? WorkflowId { get; set; }

    /// <summary>
    /// 1:Sales
    /// 2:Purchase
    /// </summary>
    public short StageId { get; set; }

    public byte? ActionId { get; set; }

    public byte? InOut { get; set; }

    public int? JournalId { get; set; }

    /// <summary>
    /// شماره سفارش
    /// </summary>
    public int? OrderNo { get; set; }

    public string Note { get; set; }

    public byte? PersonGroupTypeId { get; set; }

    public DateOnly? DocumentDate { get; set; }

    public byte? ReturnReasonId { get; set; }

    public int? TreasurySubjectId { get; set; }

    public int? AccountGlid { get; set; }

    public int? AccountSglid { get; set; }

    public int? NoSeriesId { get; set; }

    public int? AccountDetailId { get; set; }

    public byte? DocumentTypeId { get; set; }

    public decimal? SumQuantity { get; set; }

    public decimal? SumGrossAmount { get; set; }

    public decimal? SumDiscountAmount { get; set; }

    public decimal? SumNetAmount { get; set; }

    public decimal? SumVatamount { get; set; }

    public decimal? SumNetAmountPlusVat { get; set; }

    public bool? IsOrderQuantity { get; set; }

    public decimal? SumAvgNetPrice { get; set; }

    public decimal? SumTotalAvgNetAmount { get; set; }

    public decimal? SumAvgFinalPrice { get; set; }

    public decimal? SumTotalAvgFinalAmount { get; set; }

    public decimal? SumAvgGrossPrice { get; set; }

    public decimal? SumTotalAvgGrossAmount { get; set; }

    public decimal? SumAvgVatprice { get; set; }

    public decimal? SumTotalAvgVatamount { get; set; }

    public decimal? SumAvgDiscountPrice { get; set; }

    public decimal? SumTotalAvgDiscountAmount { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
