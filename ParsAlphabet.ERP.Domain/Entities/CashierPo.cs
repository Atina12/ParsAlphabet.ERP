using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class CashierPo
{
    public int Id { get; set; }

    public int? CashierId { get; set; }

    public short? PosId { get; set; }
}
