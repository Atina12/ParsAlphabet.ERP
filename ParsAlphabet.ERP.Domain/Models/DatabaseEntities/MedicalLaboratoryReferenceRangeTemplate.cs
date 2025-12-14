using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class MedicalLaboratoryReferenceRangeTemplate
{
    public int Id { get; set; }

    public int? MedicalLaboratoryResultLineTemplateId { get; set; }

    public byte? RowNumber { get; set; }

    public short? AgeRangeId { get; set; }

    public string Condition { get; set; }

    public string Description { get; set; }

    public byte? GenderId { get; set; }

    public short? GestationAgeRangeId { get; set; }

    public string HighRangeDescriptive { get; set; }

    public string LowRangeDescriptive { get; set; }

    public short? HormonalPhaseId { get; set; }

    public short? ReferenceStatusId { get; set; }

    public short? SpeciesId { get; set; }
}
