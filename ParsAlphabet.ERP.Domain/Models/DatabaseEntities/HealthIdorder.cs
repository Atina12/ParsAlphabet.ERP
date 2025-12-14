using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class HealthIdorder
{
    public int Id { get; set; }

    public int? InsurerId { get; set; }

    public short? Quantity { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
