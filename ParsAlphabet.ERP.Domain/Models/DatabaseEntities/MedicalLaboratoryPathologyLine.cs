using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

/// <summary>
/// اطلاعات تشخیصی آزمایش پاتولوژی در این جدول ثبت می شود
/// </summary>
public partial class MedicalLaboratoryPathologyLine
{
    public int Id { get; set; }

    public int? MedicalLaboratoryPathologyId { get; set; }

    /// <summary>
    /// از جدول thrICDO3
    /// </summary>
    public int? PathologyDiagnosisId { get; set; }

    /// <summary>
    /// از جدول thrICDO3
    /// </summary>
    public int? MorphologyId { get; set; }

    /// <summary>
    /// از جدول thrICDO3
    /// </summary>
    public int? MorphologyDifferentiationId { get; set; }

    /// <summary>
    /// از جدول thrICDO3
    /// </summary>
    public int? TopographyId { get; set; }

    /// <summary>
    /// از جدول thrSnomedct با مقدار 1 ستون IsLaterality
    /// </summary>
    public int? TopographyLateralityId { get; set; }

    public string DiagnosisDescription { get; set; }
}
