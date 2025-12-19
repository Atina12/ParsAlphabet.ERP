using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class BalanceInvoice
{
    public long Id { get; set; }

    public int? WorkflowId { get; set; }

    public byte? WorkflowCategoryId { get; set; }

    public long? IdentityId { get; set; }

    public byte? ItemTypeId { get; set; }

    public short? StageId { get; set; }

    public byte? StageClassId { get; set; }

    public byte? InOut { get; set; }

    public int? ItemId { get; set; }

    public string AttributeIds { get; set; }

    public short UnitId { get; set; }

    public short? SubUnitId { get; set; }

    public byte? DestintionOrigin { get; set; }

    public int? DestinationOrginIdentity { get; set; }

    public decimal? BalanceQuantity { get; set; }

    public decimal? BalanceGrossAmount { get; set; }

    public decimal? BalanceDiscountAmount { get; set; }

    public decimal? BalanceVatAmount { get; set; }
}
