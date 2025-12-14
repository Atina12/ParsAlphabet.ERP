using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionReferVitalSignsLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public decimal? PulseRate { get; set; }

    public decimal? RespiratoryRate { get; set; }

    public decimal? Temperature { get; set; }

    public DateTime? ObservationDateTime { get; set; }

    public short? TemperatureLocationId { get; set; }
}
