using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class VendorItem
{
    public int IdentityId { get; set; }

    public byte PersonGroupTypeId { get; set; }

    public int ItemId { get; set; }

    public byte ItemTypeId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public byte? NoSeriesId { get; set; }

    public int? CreateUserId { get; set; }
}
