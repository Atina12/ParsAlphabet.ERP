using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

/// <summary>
/// وضعیت نسبت به محدوده طبیعی آزمایش را نشان می دهد
/// </summary>
public partial class MadicalLaboratoryResultLineInterpretation
{
    public int Id { get; set; }

    public int? MedicalLaboratoryReferenceRangeId { get; set; }

    /// <summary>
    /// کدینگ Snomedct وقتی ستون IsResultStatus یک است
    /// </summary>
    public int? InterpretationId { get; set; }

    /// <summary>
    /// توضیح مفهومی که در فیلد Intrerpretation ثبت شده است
    /// </summary>
    public string Description { get; set; }
}
