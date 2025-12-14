using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TreasuryBond
{
    public short Id { get; set; }

    public short? BankAccountId { get; set; }

    public byte? RowNumber { get; set; }

    public string BondSerialNo { get; set; }

    public long? BondNo { get; set; }

    public short? BondCountNo { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
