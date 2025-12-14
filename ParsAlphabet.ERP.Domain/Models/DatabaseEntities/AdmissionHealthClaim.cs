using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionHealthClaim
{
    public int InsurerId { get; set; }

    public int CompanyId { get; set; }
}
