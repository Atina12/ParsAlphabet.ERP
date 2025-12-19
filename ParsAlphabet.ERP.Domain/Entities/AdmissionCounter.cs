using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionCounter
{
    public short Id { get; set; }

    public int? CounterUserId { get; set; }

    public byte? CounterTypeId { get; set; }

    public bool? IsActive { get; set; }

    public byte? CompanyId { get; set; }

    public int? CashierId { get; set; }

    public short? BranchId { get; set; }
}
