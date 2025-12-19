using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class UserWarehouse
{
    public int WarehouseId { get; set; }

    public int UserId { get; set; }

    public short ZoneId { get; set; }

    public short BinId { get; set; }

    public int? CompanyId { get; set; }
}
