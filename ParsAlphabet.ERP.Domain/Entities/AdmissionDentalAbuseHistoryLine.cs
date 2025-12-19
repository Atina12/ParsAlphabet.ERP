using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionDentalAbuseHistoryLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public decimal? AbuseDuration { get; set; }

    public short? AbuseDurationUnitId { get; set; }

    public short? SubstanceTypeId { get; set; }

    public decimal? AmountOfAbuseDosage { get; set; }

    public short? AmountOfAbuseUnitId { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? QuitDate { get; set; }
}
