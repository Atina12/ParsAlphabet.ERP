using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class CustomerDiscountGroup
{
    public short Id { get; set; }

    public short? PersonGroupId { get; set; }

    public int? MinQuantity { get; set; }

    public int? MinQuantitySale { get; set; }

    public byte? PriceTypeId { get; set; }

    public decimal? Price { get; set; }

    public DateTime? LastModifiedDateTime { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
