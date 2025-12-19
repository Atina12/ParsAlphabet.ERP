using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PatientReferralType
{
    public byte Id { get; set; }

    public byte? Code { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }
}
