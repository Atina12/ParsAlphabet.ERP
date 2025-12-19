using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionServiceExtraProperty
{
    public int AdmissionServiceId { get; set; }

    public byte ElementId { get; set; }

    public string ElementValue { get; set; }
}
