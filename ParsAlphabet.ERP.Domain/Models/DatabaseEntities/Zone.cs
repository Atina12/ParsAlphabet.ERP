using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class Zone
{
    public short Id { get; set; }

    public string Name { get; set; }

    /// <summary>
    /// North, South, East, West, International
    /// </summary>
    public string NameEng { get; set; }

    public int? WarehouseId { get; set; }

    public bool? IsActive { get; set; }

    public byte? CompanyId { get; set; }

    public string ZoneRankId { get; set; }
}
