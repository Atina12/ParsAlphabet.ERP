using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Speciality
{
    public int Id { get; set; }

    public string Name { get; set; }

    public int? TerminologyId { get; set; }

    public bool? IsActive { get; set; }

    public byte? CompanyId { get; set; }
}
