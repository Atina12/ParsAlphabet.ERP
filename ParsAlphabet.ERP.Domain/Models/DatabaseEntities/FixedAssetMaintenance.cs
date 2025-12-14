using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class FixedAssetMaintenance
{
    public int Id { get; set; }

    public int? FixedAssetId { get; set; }

    public int? VendorId { get; set; }

    public DateTime? NextServiceDate { get; set; }

    public DateTime? WarrantyDate { get; set; }

    public bool? UnderMaintenance { get; set; }
}
