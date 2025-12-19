using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

/// <summary>
/// ماه های کاری و ساعت موظفی کارکرد برای یک تقویم استاندارد در این جدول تعریف می شود
/// </summary>
public partial class StandardTimeSheetPerMonth
{
    /// <summary>
    /// شناسه ساعت کاری استاندارد ماهانه
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// شناسه تقویم استاندارد
    /// </summary>
    public short StandardTimeSheetId { get; set; }

    /// <summary>
    /// ماه شمسی
    /// </summary>
    public byte MonthId { get; set; }

    /// <summary>
    /// تعداد ساعت کاری موظفی قانون کار
    /// </summary>
    public short StandardMonthWorkingHours { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
