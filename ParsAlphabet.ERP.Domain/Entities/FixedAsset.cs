using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class FixedAsset
{
    public int Id { get; set; }

    public int? ItemId { get; set; }

    public byte? MainAssetComponent { get; set; }

    public int? FixedAssetId { get; set; }

    public short? FixedAssetSubClassId { get; set; }

    public string TechnicalCode { get; set; }

    public byte? DepreciationMethodId { get; set; }

    public DateOnly? DepreciationStartDate { get; set; }

    public DateOnly? DepreciationEndDate { get; set; }

    public bool? UnderMaintenance { get; set; }

    public byte? DepreciationPeriodType { get; set; }

    /// <summary>
    /// دوره استهلاک
    /// </summary>
    public byte? DepreciationPeriod { get; set; }

    public bool? DepreciationEnable { get; set; }

    public bool? IsActive { get; set; }

    public byte? CompanyId { get; set; }
}
