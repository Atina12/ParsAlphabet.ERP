using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionReferPulseLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public bool? IsPulsePresent { get; set; }

    public decimal? PulseRate { get; set; }

    public string ClinicalDescription { get; set; }

    public short? PositionId { get; set; }

    public short? MethodId { get; set; }

    public DateTime? ObservationDateTime { get; set; }

    public short? CharacterId { get; set; }

    public short? LocationOfMeasurmentId { get; set; }

    public short? RegularityId { get; set; }

    public short? VolumeId { get; set; }
}
