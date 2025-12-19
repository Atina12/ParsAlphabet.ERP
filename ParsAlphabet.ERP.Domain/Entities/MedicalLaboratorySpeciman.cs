using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class MedicalLaboratorySpeciman
{
    public int Id { get; set; }

    public int? DepartmentId { get; set; }

    /// <summary>
    /// از جدول thrSpecimenAdequacy
    /// </summary>
    public short? AdequacyForTestingId { get; set; }

    /// <summary>
    /// از جدول thrSnomedct به مقدار 1 ستون IsCollectionProcedure
    /// </summary>
    public short? CollectionProcedureId { get; set; }

    /// <summary>
    /// تاریخ اخذ نمونه می باشد. در صورتی که نمونه در خود آزمایشگاه اخذ شده باشد
    /// </summary>
    public DateTime? CollectionDateTime { get; set; }

    /// <summary>
    /// کد منحصر به فرد نمونه آزمایش به صورت محلی توسط آزمایشگاه داده می شود
    /// </summary>
    public string SpecimenIdentifier { get; set; }

    /// <summary>
    /// از جدول thrSnomedct به مقدار 1 ستون IsSpecimenType - در سند SpeciemnTissueType است
    /// </summary>
    public short? SpecimenTypeId { get; set; }

    /// <summary>
    /// تعداد دفعات تکرار نمونه گیری
    /// </summary>
    public byte? SpecimenFrequency { get; set; }

    /// <summary>
    /// تاریخ دریافت نمونه می باشد در صورتی که نمونه در جای دیگری گرفته شده باشد و تحویل آزمایشگاه شده باشد
    /// </summary>
    public DateTime? RecieptDateTime { get; set; }

    /// <summary>
    /// جدول LabRequest میتواند حذف شود چون در صورتی که نمونه از مرکز دیگری گرفته شده باشد، شرکت همکار گیرنده نمونه آزمایش
    /// </summary>
    public byte? CoWorkerCompanyId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? ModifyDateTime { get; set; }
}
