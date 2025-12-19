using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class MedicalLaboratoryPathologyLineTemplate
{
    public int Id { get; set; }

    public int? MedicalLaboratoryPathologyTemplateId { get; set; }

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
