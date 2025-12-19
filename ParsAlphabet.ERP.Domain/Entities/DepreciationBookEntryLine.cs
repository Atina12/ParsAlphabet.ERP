using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class DepreciationBookEntryLine
{
    public int Id { get; set; }

    public int? HeaderId { get; set; }

    public byte? RowNumber { get; set; }

    public int? FixedAssetId { get; set; }

    public short? FixedAssetSubClassId { get; set; }

    public short? FixedAssetCategoryId { get; set; }

    public bool? MainAssetComponent { get; set; }

    public DateTime? AcquisitionDate { get; set; }

    public byte? DepreciationMethodId { get; set; }

    /// <summary>
    /// دوره استهلاک
    /// </summary>
    public byte? DepreciationPeriod { get; set; }

    public bool? DepreciationEnable { get; set; }

    public DateTime? DepreciationStartDate { get; set; }

    public DateTime? DepreciationEndDate { get; set; }

    public bool? UnderMaintenance { get; set; }

    public int? AcquisitionQuantity { get; set; }

    public decimal? AcquisitionAmount { get; set; }

    public decimal? RevaluationAmount { get; set; }

    public decimal? DepreciationAmount { get; set; }

    public decimal? DepreciationRevAmount { get; set; }

    public decimal? BeginAccumulatedDepreciationAmount { get; set; }

    public decimal? AccumulatedDepreciationAmount { get; set; }

    public decimal? AccumulatedDepreciationRevAmount { get; set; }
}
