using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AttenderServicePrice
{
    public int Id { get; set; }

    public int? CentralId { get; set; }

    /// <summary>
    /// شناسه طبیب
    /// </summary>
    public int? AttenderId { get; set; }

    public int? ServiceId { get; set; }

    public byte? MedicalSubjectId { get; set; }

    /// <summary>
    /// شناسه انواع حق الزحمهطبیب در یک دپارتمان
    /// </summary>
    public int? AttenderMarginBracketId { get; set; }

    public int? CompanyId { get; set; }

    /// <summary>
    /// شناسه آخرین کاربری که ردیف را تغییر داده است
    /// </summary>
    public int? CreateUserId { get; set; }

    /// <summary>
    /// آخرین تاریخ تغییر ردیف
    /// </summary>
    public DateTime? CreateDateTime { get; set; }
}
