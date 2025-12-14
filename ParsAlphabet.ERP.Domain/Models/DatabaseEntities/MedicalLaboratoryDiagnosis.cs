using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

/// <summary>
/// تشخیصی که برای نسخه آزمایش نوشته شده متصور است در این جدول ثبت می شود. به نظر فایده خاصی ندارد و در ایران در آزمایشگاه کسی تشخیص نمی دهد.
/// </summary>
public partial class MedicalLaboratoryDiagnosis
{
    public int Id { get; set; }

    public int MedicalLaboratoryId { get; set; }

    /// <summary>
    /// از جدول thrDiagnosisStatus
    /// </summary>
    public byte? DiagnosisStatusId { get; set; }

    /// <summary>
    /// از جدول thrOrdinalTerm
    /// </summary>
    public byte? ServerityId { get; set; }

    public string Comment { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
