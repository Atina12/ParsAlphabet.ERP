using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

/// <summary>
/// شیفت های موجود در سیستم به ازای هر دپارتمان مثلا شیفت صبح فارق از تاریخ
/// </summary>
public partial class DepartmentTimeShift
{
    /// <summary>
    /// شناسه شیفت
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// شناسه سال مالی
    /// </summary>
    public short? FiscalYearId { get; set; }

    public short? BranchId { get; set; }

    /// <summary>
    /// شناسه دپارتمان
    /// </summary>
    public int? DepartmentId { get; set; }

    /// <summary>
    /// عنوان شیفت
    /// </summary>
    public string ShiftName { get; set; }

    public string Description { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? ModifiedUserId { get; set; }

    public DateTime? ModifiedDateTime { get; set; }
}
