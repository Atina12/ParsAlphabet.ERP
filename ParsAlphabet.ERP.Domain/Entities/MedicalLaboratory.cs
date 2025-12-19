using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

/// <summary>
/// اطلاعات پاسخ یک نسخه آزمایشگاه و ارسال آن به سپاس در این جدول ثبت می شود
/// </summary>
public partial class MedicalLaboratory
{
    public int Id { get; set; }

    public int? AdmissionId { get; set; }

    public int? WorkflowId { get; set; }

    public short? StageId { get; set; }

    public byte? ActionId { get; set; }

    /// <summary>
    /// از جدول thrLifeCycle
    /// </summary>
    public byte? LifeCycleStateId { get; set; }

    public bool? IsQueriable { get; set; }

    /// <summary>
    /// از جدول Attender
    /// </summary>
    public int? ReferringDoctorId { get; set; }

    public string CompositionUid { get; set; }

    public string MessageUid { get; set; }

    public string PersonUid { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public bool? IsCompSent { get; set; }

    public byte? SentResult { get; set; }

    public DateTime? SentDateTime { get; set; }

    public string ReferralId { get; set; }

    public string RelatedHid { get; set; }

    /// <summary>
    /// کدینگ thritaEHR
    /// </summary>
    public int? Category { get; set; }

    /// <summary>
    /// تاریخی که جواب آزمایش آماده می شود
    /// </summary>
    public DateTime? ResultDateTime { get; set; }

    public string Note { get; set; }
}
