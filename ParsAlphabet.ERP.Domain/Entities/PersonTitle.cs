using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PersonTitle
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public byte? PartnerType { get; set; }
}
