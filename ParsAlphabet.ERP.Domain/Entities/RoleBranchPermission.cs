using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class RoleBranchPermission
{
    public short Id { get; set; }

    public byte? RoleId { get; set; }

    public short? BranchId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
