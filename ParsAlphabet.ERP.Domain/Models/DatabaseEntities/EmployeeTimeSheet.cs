using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

/// <summary>
/// ارتباط یک کارمند با ماه های کاری و شیفت های کاری در این جدول تعریف می شود. به عبارت دیگر یک کارمند در چه ماهی چه شیفتی به صورت کلی دارد.
/// </summary>
public partial class EmployeeTimeSheet
{
    /// <summary>
    /// شناسه شیفت در ماه کارمند
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// شناسه کارمند
    /// </summary>
    public int? EmployeeId { get; set; }

    /// <summary>
    /// شناسه ساعت کاری استاندارد ماهانه
    /// </summary>
    public int? StandardTimeSheetPerMonthId { get; set; }

    /// <summary>
    /// شناسه شیفت
    /// </summary>
    public int? DepartmentTimeShiftId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
