using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class MedicalLaboratoryResultTemplate
{
    public int Id { get; set; }

    public byte RowNumber { get; set; }

    public int LaboratoryPanelId { get; set; }

    public string Note { get; set; }

    public int MedicalLabolatorySpecimenTemplateId { get; set; }

    public int? LabMethodId { get; set; }

    public string MethodDescription { get; set; }
}
