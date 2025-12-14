using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ServiceCenter
{
    public short Id { get; set; }

    public int? DepartmentId { get; set; }

    public string Unit { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }

    public bool? Slide { get; set; }
}
