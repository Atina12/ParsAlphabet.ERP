using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

/// <summary>
/// حضور یک پزشک در یک روز و یک شیفت خاص در این جدول قرار می گیرد.
/// </summary>
public partial class AttenderTimeSheet
{
    public int Id { get; set; }

    /// <summary>
    /// شناسه شیفت
    /// </summary>
    public int? DepartmentTimeShiftId { get; set; }

    public short BranchId { get; set; }

    public int AttenderId { get; set; }

    /// <summary>
    /// 1:غیرفعال
    /// 2:نامحدود
    /// 3:محدود
    /// </summary>
    public byte? IsOfflineBookingUnlimit { get; set; }

    /// <summary>
    /// تعداد نوبت آنلاین
    /// </summary>
    public short? NumberOnlineAppointment { get; set; }

    /// <summary>
    /// تعداد نوبت حضوری
    /// </summary>
    public short? NumberOfflineAppointment { get; set; }

    public int? NumberOfAppointment { get; set; }

    /// <summary>
    /// شناسه نحوه توزیع نوبت های آنلاین و حضوری
    /// </summary>
    public byte? AppointmentDistributionTypeId { get; set; }

    /// <summary>
    /// تاریخ روز کاری
    /// </summary>
    public DateOnly WorkDayDate { get; set; }

    public byte DayInWeek { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? ModifiedUserId { get; set; }

    public DateTime? ModifiedDateTime { get; set; }

    public bool? Locked { get; set; }
}
