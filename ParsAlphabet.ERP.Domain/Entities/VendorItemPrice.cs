using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class VendorItemPrice
{
    public int Id { get; set; }

    public int? ItemId { get; set; }

    public short? ContractTypeId { get; set; }

    public int? VendorId { get; set; }

    public byte? PriceTypeId { get; set; }

    public decimal? CommissionValue { get; set; }

    public byte? CompanyId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
