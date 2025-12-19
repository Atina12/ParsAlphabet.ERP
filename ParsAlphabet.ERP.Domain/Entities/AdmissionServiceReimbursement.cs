using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionServiceReimbursement
{
    public int Id { get; set; }

    public int HeaderId { get; set; }

    public int ServiceId { get; set; }

    public byte? ConfirmedBySystem { get; set; }

    public decimal? ConfirmedBasicSharePrice { get; set; }

    public decimal? ConfirmedCompSharePrice { get; set; }

    public decimal? ConfirmedPatientSharePrice { get; set; }

    public decimal? ConfirmedDeduction { get; set; }

    public int? ConfirmedServiceCount { get; set; }
}
