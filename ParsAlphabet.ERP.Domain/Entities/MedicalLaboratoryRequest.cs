using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

/// <summary>
/// اگر نمونه گیری بیرون از مرکز آزمایشگاه انجام شده بود مقادیر نمونه اینجا پر می شود
/// </summary>
public partial class MedicalLaboratoryRequest
{
    /// <summary>
    /// این جدول در صورتی که نیاز به ثبت اطلاعات نمونه آزمایش ارسالی مثل آزمایش پاتولوژی باشد، پر می شود
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// id جدول MedicalLaboratory
    /// </summary>
    public int MedicalLaboratoryId { get; set; }

    public byte? RowNumber { get; set; }

    /// <summary>
    /// تنها در صورتی که نمونه همراه با درخواست آزمایش ارسال شده باشد، اطلاعات نمونه در این جدول ذخیره می شود. در واقع نمونه همراه با نسخه آزمایش ارسال می شود
    /// </summary>
    public string SpecimenCode { get; set; }

    public DateTime? SpecimenDateTime { get; set; }

    /// <summary>
    /// از جدول thrSnomedct به مقدار 1 ستون IsSpecimenType
    /// </summary>
    public short? SpecimenTypeId { get; set; }

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

    public short? SpecimenTissueTypeId { get; set; }
}
