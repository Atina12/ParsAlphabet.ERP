using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class MedicalLaboratorySpecimenTemplate
{
    public int Id { get; set; }

    public short? MedicalLaboratoryTemplateId { get; set; }

    public short? AdequacyForTestingId { get; set; }

    public short? CollectionProcedureId { get; set; }

    public string SpecimenIdentifier { get; set; }

    public short? SpecimenTypeId { get; set; }
}
