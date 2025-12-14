using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class Po
{
    public short Id { get; set; }

    public string Name { get; set; }

    public int? BankAccountId { get; set; }

    public string TerminalNo { get; set; }

    public bool? IsPcPos { get; set; }

    public string CashierIpAddress { get; set; }

    public bool? IsActive { get; set; }

    public byte? CompanyId { get; set; }

    public byte? PosProviderId { get; set; }

    public int? CashierId { get; set; }
}
