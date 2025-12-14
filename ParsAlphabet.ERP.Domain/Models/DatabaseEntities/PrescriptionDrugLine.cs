using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class PrescriptionDrugLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    /// <summary>
    /// thrERX
    /// </summary>
    public short? ProductId { get; set; }

    public short? AsNeedId { get; set; }

    /// <summary>
    /// thrSNOMEDCT
    /// </summary>
    public decimal? Dosage { get; set; }

    /// <summary>
    /// thrUCUM
    /// </summary>
    public short? DosageUnitId { get; set; }

    /// <summary>
    /// thrSNOMEDCT
    /// </summary>
    public short? FrequencyId { get; set; }

    /// <summary>
    /// thrSNOMEDCT
    /// </summary>
    public short? RouteId { get; set; }

    /// <summary>
    /// thrSNOMEDCT
    /// </summary>
    public short? MethodId { get; set; }

    public short? PriorityId { get; set; }

    public int? ReasonId { get; set; }

    public short? BodySiteId { get; set; }

    public bool? IsCompounded { get; set; }

    public short? TotalNumber { get; set; }

    public short? TotalNumberUnitId { get; set; }

    public short? MaxNumber { get; set; }

    public string Description { get; set; }

    public string PatientInstruction { get; set; }
}
