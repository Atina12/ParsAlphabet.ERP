using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Bundle
{
    public byte Id { get; set; }

    public int? CashierId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public short? BranchId { get; set; }

    public byte? Type { get; set; }

    public byte? ItemTypeId { get; set; }

    public short? Priority { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public bool? IsActive { get; set; }
}
