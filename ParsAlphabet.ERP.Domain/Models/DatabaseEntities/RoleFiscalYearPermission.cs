using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class RoleFiscalYearPermission
{
    public short Id { get; set; }

    public byte? RoleId { get; set; }

    public short? FiscalYearId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
