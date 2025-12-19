using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PostingGroupJob
{
    public int Id { get; set; }

    public byte? CompanyId { get; set; }

    public short? BranchId { get; set; }

    public bool? IsActive { get; set; }
}
