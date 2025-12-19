using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class EmployeeContract
{
    public short Id { get; set; }

    public int EmployeeId { get; set; }

    public int? StartDate { get; set; }

    public int? ExpDate { get; set; }

    public short? Scid { get; set; }

    public short? StaxId { get; set; }

    public short? WorkGroupId { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
