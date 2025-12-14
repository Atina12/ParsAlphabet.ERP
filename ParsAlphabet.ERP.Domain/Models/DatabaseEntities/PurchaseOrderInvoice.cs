using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class PurchaseOrderInvoice
{
    public int Id { get; set; }

    public int? RequestId { get; set; }

    public int? JournalId { get; set; }

    public short? StageId { get; set; }

    public short? BranchId { get; set; }

    public string Note { get; set; }

    public int? NoSeriesId { get; set; }

    public int? AccountDetailId { get; set; }

    public byte? InOut { get; set; }

    public byte? DocumentTypeId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public byte? ActionId { get; set; }

    public decimal? SumQuantity { get; set; }

    public decimal? SumGrossAmount { get; set; }

    public decimal? SumDiscountAmount { get; set; }

    public decimal? SumNetAmount { get; set; }

    public decimal? SumVatAmount { get; set; }

    public decimal? SumNetAmountPlusVat { get; set; }

    public string OrderNo { get; set; }

    public DateTime? OrderDate { get; set; }

    public byte? ReturnReasonId { get; set; }

    public bool? IsOrderQuantity { get; set; }

    public int? WorkflowId { get; set; }

    public int? CompanyId { get; set; }
}
