using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class SaleOrderActionLog
{
    public int Id { get; set; }

    public int? SaleOrderId { get; set; }

    public int? UserId { get; set; }

    public short? StageId { get; set; }

    public byte? ActionId { get; set; }

    public DateTime? CreateDate { get; set; }
}
