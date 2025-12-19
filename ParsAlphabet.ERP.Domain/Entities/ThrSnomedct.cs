using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ThrSnomedct
{
    public short Id { get; set; }

    public string Code { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public string CodingType { get; set; }

    public bool? IsMethod { get; set; }

    public bool? IsDrugName { get; set; }

    public bool? IsRoute { get; set; }

    public bool? IsRole { get; set; }

    public bool? IsBodySite { get; set; }

    public bool? IsFrequency { get; set; }

    public bool? IsAsNeed { get; set; }

    public bool? IsPriority { get; set; }

    public bool? IsImageServiceDetail { get; set; }

    public bool? IsAbuse { get; set; }

    public bool? IsLaterality { get; set; }

    public bool? IsBloodPressure { get; set; }

    public bool? IsToothPart { get; set; }

    public bool? IsSpecimenType { get; set; }

    public bool? IsCollectionProcedure { get; set; }

    public bool? IsLabMethod { get; set; }

    public bool? IsGestationAgeRange { get; set; }

    public bool? IsHormonalPhase { get; set; }

    public bool? IsReferenceStatus { get; set; }

    public bool? IsSpecies { get; set; }

    public bool? IsAgeRange { get; set; }

    public bool? IsResultStatus { get; set; }

    public bool? IsIntent { get; set; }

    public bool? IsPriorityPrescription { get; set; }

    public bool? IsLocationOfMeasurment { get; set; }

    public bool? IsCharacter { get; set; }

    public bool? IsTemperatureLocation { get; set; }

    public bool? IsCausativeAgentCategory { get; set; }

    public bool? IsReactionCategory { get; set; }

    public bool? IsReaction { get; set; }

    public bool? IsVolume { get; set; }

    public bool? IsRegularity { get; set; }

    public bool? IsActive { get; set; }
}
