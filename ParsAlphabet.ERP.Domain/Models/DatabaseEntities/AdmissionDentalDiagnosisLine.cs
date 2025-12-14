using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionDentalDiagnosisLine
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public byte? StatusId { get; set; }

    public int? DiagnosisResonId { get; set; }

    public byte? ServerityId { get; set; }

    public string Comment { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
