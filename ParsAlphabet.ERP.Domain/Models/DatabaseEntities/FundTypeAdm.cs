using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class FundTypeAdm
{
    public int Id { get; set; }

    public byte? SaleTypeId { get; set; }

    public byte? FundTypeId { get; set; }

    public bool? Recieve { get; set; }

    public bool? Payment { get; set; }
}
