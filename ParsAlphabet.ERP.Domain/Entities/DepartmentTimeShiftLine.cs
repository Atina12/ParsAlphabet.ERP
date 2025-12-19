using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

/// <summary>
/// لاین های شیفت های موجود در سیستم مثلا برای شنبه از چه ساعتی تا چه ساعتی کاری است
/// </summary>
public partial class DepartmentTimeShiftLine
{
    /// <summary>
    /// شناسه لاین شیفت کاری
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// شناسه شیفت
    /// </summary>
    public int? HeaderId { get; set; }

    /// <summary>
    /// روز هفته
    /// </summary>
    public byte? DayInWeek { get; set; }

    /// <summary>
    /// ساعت شروع شیفت
    /// </summary>
    public TimeOnly? StartTime { get; set; }

    /// <summary>
    /// ساعت پایان شیفت
    /// </summary>
    public TimeOnly? EndTime { get; set; }

    public bool? Locked { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
