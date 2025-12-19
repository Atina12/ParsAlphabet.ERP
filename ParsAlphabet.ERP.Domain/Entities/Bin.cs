using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Bin
{
    public short Id { get; set; }

    public string Name { get; set; }

    public int? WarehouseId { get; set; }

    public short? ZoneId { get; set; }

    public byte? CategoryId { get; set; }

    public string BinRankId { get; set; }

    public bool? IsActive { get; set; }

    public byte? CompanyId { get; set; }

    public bool? NegativeInventory { get; set; }
}
