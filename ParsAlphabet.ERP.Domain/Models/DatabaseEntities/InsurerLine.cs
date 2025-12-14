using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class InsurerLine
{
    public short Id { get; set; }

    public int? InsurerId { get; set; }

    public string Name { get; set; }

    public byte? InsuranceBoxTerminologyId { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
