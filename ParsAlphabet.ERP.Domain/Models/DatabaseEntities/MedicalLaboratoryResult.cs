using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

/// <summary>
/// لیست پاسخ های آزمایش در این جدول ثبت می شود. به ازای هر پنل آزمایش در نسخه آزمایش یک رکورد ثبت می شود.
/// </summary>
public partial class MedicalLaboratoryResult
{
    public int Id { get; set; }

    public int MedicalLaboratoryId { get; set; }

    public byte RowNumber { get; set; }

    /// <summary>
    /// شناسه خدمت از جدول Service که معادل لوینک دارد و پنل است
    /// </summary>
    public int LaboratoryPanelId { get; set; }

    public string Note { get; set; }

    public int MedicalLabolatorySpecimenId { get; set; }

    /// <summary>
    /// از جدول trhSnomedct به مقدار 1 ستون IsLabMethod - علت قرارگیری موارد مربوط به پروتکل انجام آزمایش در این جدول این است که ممکن است یک یا چند پنل از یک نمونه گرفته شده استفاده کنند ولی روش انجام آزمایششان متفاوت باشد لذا در جدول نمونه قرار نگرفت
    /// </summary>
    public int? LabMethodId { get; set; }

    /// <summary>
    /// توضیحات روش انجام آزمایش
    /// </summary>
    public string MethodDescription { get; set; }

    /// <summary>
    /// تاریخ شروع انجام آزمایش بر روی نمونه در آزمایشگاه
    /// </summary>
    public DateTime? ProcessDateTime { get; set; }

    /// <summary>
    /// تاریخ دریافت نمونه از قسمت نمونه گیری به قسمت آزمایشگاه می باشد
    /// </summary>
    public DateTime? RecieptDateTime { get; set; }

    /// <summary>
    /// شرکت همکار ارسال کننده نتیجه آزمایش
    /// </summary>
    public byte? CoWorkerCompanyId { get; set; }
}
