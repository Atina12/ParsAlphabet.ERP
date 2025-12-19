using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

/// <summary>
/// روزهای تعطیل مربوط به یک تقویم استاندارد در این جدول تعریف می شود
/// </summary>
public partial class StandardTimeSheetHoliday
{
    /// <summary>
    /// شناسه تعطیلات تقویم استاندارد
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// شناسه تقویم استاندارد
    /// </summary>
    public short? HeaderId { get; set; }

    public DateOnly? HolidayDate { get; set; }

    /// <summary>
    /// ماه شمسی
    /// </summary>
    public byte? MonthId { get; set; }

    /// <summary>
    /// روز شمسی
    /// </summary>
    public byte? DayId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
