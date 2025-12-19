using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class MadicalLaboratoryResultLineInterpretationTemplate
{
    public int Id { get; set; }

    public int? MedicalLaboratoryReferenceRangeTemplateId { get; set; }

    public int? InterpretationId { get; set; }

    public string Description { get; set; }
}
