using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

/// <summary>
/// در صورتی که آزمایش کشت میکروبی باشد، اطلاعات در این جدول ذخیره می شود. علت این است که کشت میکروبی دارای جزئیات بیشتری از یک آزمایش معمولی دارد.
/// </summary>
public partial class MedicalLaboratoryMicrobiologicalCulture
{
    public int Id { get; set; }

    public int? MedicalLaboratoryResultId { get; set; }

    public int? ColonyCount { get; set; }

    public int? ColonyUnitId { get; set; }

    public int? CultureTypeId { get; set; }

    public int? GrowthDurationTypeId { get; set; }

    public int? AntibiogramAgentId { get; set; }

    public int? AntibiogramSensitivityId { get; set; }

    public int? MicrobialFindingBioTypeId { get; set; }

    public int? MicrobialFindingOrganismId { get; set; }
}
