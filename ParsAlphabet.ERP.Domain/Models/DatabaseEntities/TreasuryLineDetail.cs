using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TreasuryLineDetail
{
    public long Id { get; set; }

    public string SayadNumber { get; set; }

    public long? CheckSerial { get; set; }

    public long? CheckNumber { get; set; }

    public long? CheckBranchNo { get; set; }

    public string CheckBranchName { get; set; }

    public DateTime? CheckDueDate { get; set; }

    public string CheckIssuer { get; set; }

    public short? CheckBankIssuerId { get; set; }

    public string CheckBankAccountIssuer { get; set; }

    public byte? CheckLastStep { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }
}
