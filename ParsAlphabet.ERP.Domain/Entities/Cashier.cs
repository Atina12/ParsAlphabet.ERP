using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Cashier
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public short? BranchId { get; set; }

    public int? CompanyId { get; set; }

    public bool? IsStand { get; set; }

    public bool? IsActive { get; set; }

    public string IpAddress { get; set; }
}
