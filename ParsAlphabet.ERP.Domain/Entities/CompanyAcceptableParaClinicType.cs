using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class CompanyAcceptableParaClinicType
{
    public byte Id { get; set; }

    public int? SetupClientTaminId { get; set; }

    public string AcceptableParaClinicTypeId { get; set; }
}
