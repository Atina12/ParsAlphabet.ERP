using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionRevenueAllocation
{
    public DateOnly ReserveDate { get; set; }

    public short AttenderId { get; set; }

    public short BranchId { get; set; }
}
