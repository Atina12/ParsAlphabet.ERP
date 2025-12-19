using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class RollCallDevice
{
    public short Id { get; set; }

    public short? BranchId { get; set; }

    public string Name { get; set; }

    public string IpAddress { get; set; }

    public int? Interval { get; set; }

    public byte? IntervalType { get; set; }

    public bool? IsAutoTransfer { get; set; }

    public string NecessaryMobileNo { get; set; }

    public string DevicePassword { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
