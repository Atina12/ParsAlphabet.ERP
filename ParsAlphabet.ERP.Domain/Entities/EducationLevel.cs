using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class EducationLevel
{
    public short Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }
}
