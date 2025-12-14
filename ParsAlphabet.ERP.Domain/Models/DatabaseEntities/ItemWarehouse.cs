using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ItemWarehouse
{
    public int ItemId { get; set; }

    public int WarehouseId { get; set; }

    public byte ItemTypeId { get; set; }

    public short ZoneId { get; set; }

    public short BinId { get; set; }

    public int CreateuserId { get; set; }

    public DateTime CreateDateTime { get; set; }

    public int? CompanyId { get; set; }
}
