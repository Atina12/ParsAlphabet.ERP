using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class EmployeeContractType
{
    public short Id { get; set; }

    public string Name { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
