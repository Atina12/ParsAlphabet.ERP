using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionClose
{
    public int Id { get; set; }

    public DateTime? CreateDatetime { get; set; }

    public DateTime? WorkDayDate { get; set; }

    public DateTime? CloseDateTime { get; set; }

    public int? CloseUserId { get; set; }

    public short? BranchId { get; set; }

    public int? UserId { get; set; }

    public int? CompanyId { get; set; }

    public bool? RevenueAllocation { get; set; }

    public int? AdmServiceJournalId { get; set; }

    public int? AdmGoodsJournalId { get; set; }

    public int? TreasuryId { get; set; }
}
