using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

/// <summary>
/// محدوده طبیعی آزمایش برای یک پاسخ آزمایش در این جدول ثبت می شود
/// </summary>
public partial class MedicalLaboratoryReferenceRange
{
    public int Id { get; set; }

    public int? MedicalLaboratoryResultLineId { get; set; }

    public byte? RowNumber { get; set; }

    /// <summary>
    /// از جدول thrSnomedct به مقدار 1 برای ستون IsAgeRange
    /// </summary>
    public short? AgeRangeId { get; set; }

    /// <summary>
    /// شرط خاص برای محدوده طبیعی مثلا دیابت
    /// </summary>
    public string Condition { get; set; }

    public string Description { get; set; }

    /// <summary>
    /// از جدول trhGender
    /// </summary>
    public byte? GenderId { get; set; }

    /// <summary>
    /// از جدول thrSnomedct به مقدار 1 برای ستون IsGestationAgeRange
    /// </summary>
    public short? GestationAgeRangeId { get; set; }

    /// <summary>
    /// حد بالایی و حداکثر طبیعی
    /// </summary>
    public string HighRangeDescriptive { get; set; }

    /// <summary>
    /// حد پایینی و حداقل طبیعی
    /// </summary>
    public string LowRangeDescriptive { get; set; }

    /// <summary>
    /// از جدول thrSnomedct به مقدار 1 برای ستون IsHormonalPhase
    /// </summary>
    public short? HormonalPhaseId { get; set; }

    /// <summary>
    /// از جدول thrSnomedct به مقدار 1 برای ستون IsReferenceStatus
    /// </summary>
    public short? ReferenceStatusId { get; set; }

    /// <summary>
    /// از جدول thrSnomedct به مقدار 1 برای ستون IsSpecies
    /// </summary>
    public short? SpeciesId { get; set; }
}
