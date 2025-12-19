using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

/// <summary>
/// بلوک های زمانی که هر پزشک بر اساس شیفتش و تعداد بیمارانی که باید در آن شیفت ببیند در این جدول قرار میگیرد. هر ردیف در این جدول نمایانگر یک نوبت خالی است.
/// </summary>
public partial class AttenderScheduleBlock
{
    public Guid Id { get; set; }

    public Guid? CentralId { get; set; }

    public int? AttenderTimeSheetId { get; set; }

    public DateOnly? AppointmentDate { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public bool? IsOnline { get; set; }

    public short? ReserveNo { get; set; }

    public DateOnly? BookingStartDate { get; set; }

    public DateOnly? BookingEndDate { get; set; }

    public int? AdmissionId { get; set; }

    public int? PatientId { get; set; }

    public int? ReserveUserId { get; set; }

    public DateTime? ReserveDateTime { get; set; }

    public string TrackingCode { get; set; }

    public bool? Locked { get; set; }
}
