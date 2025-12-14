using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class MedicalLaboratoryResultLineTemplate
{
    public int Id { get; set; }

    public int MedicalLaboratoryResultTemplateId { get; set; }

    public int? TestNameId { get; set; }

    public byte? TestSequence { get; set; }

    public string Comment { get; set; }

    public string Note { get; set; }

    public int? StatusId { get; set; }
}
